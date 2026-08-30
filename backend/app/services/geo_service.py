import math
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    Node, NodeType, Case, GeoLocationPoint, GeoCrimeCluster, GeoClustersResponse
)
from app.services.graph_engine import graph_engine
from app.services.seed_data import DEMO_CASES

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two geographic coordinates in kilometers."""
    R = 6371.0 # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

class GeoSpatialService:
    """
    Geospatial Crime Intelligence & Hotspot Clustering Service.
    Maps physical criminal infrastructure, computes spatial proximity clusters,
    and identifies gang operating territories across India.
    """

    def get_geo_clusters(
        self,
        radius_km: float = 15.0,
        crime_category: Optional[str] = None,
        case_id: Optional[str] = None,
        risk_level: Optional[str] = None
    ) -> GeoClustersResponse:
        
        # 1. Harvest and normalize all Location nodes
        points: List[GeoLocationPoint] = []

        for node in graph_engine.nodes_dict.values():
            if node.type != NodeType.LOCATION:
                continue

            props = node.properties or {}
            lat = props.get("latitude")
            lng = props.get("longitude")

            # Parse from "coordinates": "lat, lng" string if float fields not directly set
            if (lat is None or lng is None) and "coordinates" in props:
                try:
                    coords = props["coordinates"].split(",")
                    lat = float(coords[0].strip())
                    lng = float(coords[1].strip())
                except Exception:
                    pass

            if lat is None or lng is None:
                continue

            # Resolve associated case metadata
            c_id = node.case_ids[0] if node.case_ids else "CASE-HAWALA-2024"
            case_obj = next((c for c in DEMO_CASES if c.id == c_id), None)
            
            fir = case_obj.fir_number if case_obj else f"FIR-REF-{c_id}"
            cat = case_obj.crime_category if case_obj else "General Crime"
            city = props.get("city") or (case_obj.state if case_obj else "Delhi")
            state = props.get("state") or (case_obj.state if case_obj else "Delhi NCR")
            loc_type = props.get("type") or "Crime Scene"

            # Apply filters
            if crime_category and crime_category.lower() != 'all':
                if crime_category.lower() not in cat.lower():
                    continue

            if case_id and case_id.lower() != 'all':
                if case_id not in node.case_ids:
                    continue

            if risk_level and risk_level.lower() != 'all':
                if node.risk_level.lower() != risk_level.lower():
                    continue

            points.append(GeoLocationPoint(
                id=node.id,
                label=node.label,
                latitude=float(lat),
                longitude=float(lng),
                case_id=c_id,
                fir_number=fir,
                crime_category=cat,
                risk_level=node.risk_level,
                location_type=loc_type,
                city=city,
                state=state,
                evidence_ref=node.milestone_note or props.get("type"),
                discovered_date=node.discovered_date
            ))

        # 2. Compute Proximity Clusters via spatial distance
        visited = set()
        clusters: List[GeoCrimeCluster] = []
        cluster_idx = 1

        for i, pt in enumerate(points):
            if pt.id in visited:
                continue

            # Form a new cluster group
            group = [pt]
            visited.add(pt.id)

            for j, other in enumerate(points):
                if other.id in visited:
                    continue

                dist = haversine_distance(pt.latitude, pt.longitude, other.latitude, other.longitude)
                if dist <= radius_km:
                    group.append(other)
                    visited.add(other.id)

            # Compute cluster centroid
            avg_lat = sum(p.latitude for p in group) / len(group)
            avg_lng = sum(p.longitude for p in group) / len(group)

            # Compute actual cluster radius
            max_dist = max([haversine_distance(avg_lat, avg_lng, p.latitude, p.longitude) for p in group], default=1.0)
            cluster_radius = round(max(1.5, max_dist), 1)

            # Dominant crime category and FIRS
            categories = [p.crime_category for p in group]
            dom_cat = max(set(categories), key=categories.count)
            firs = list(set(p.fir_number for p in group))
            cities = list(set(p.city for p in group))
            loc_names = ", ".join([p.label.split("(")[0].strip() for p in group[:3]])

            # Assign Severity
            if any(p.risk_level == "Critical" for p in group):
                sev = "CRITICAL"
            elif any(p.risk_level == "High" for p in group):
                sev = "HIGH"
            else:
                sev = "MODERATE"

            # Formulate Gang Territory & Hotspot Narrative
            city_label = cities[0] if cities else "Regional"
            if len(group) >= 3:
                title = f"{city_label} Multi-Crime Convergence Hotspot"
                narrative = (
                    f"High-density criminal nexus ({len(group)} locations across {len(firs)} separate FIRs within {cluster_radius} km radius). "
                    f"Cross-jurisdictional concentration of {dom_cat} and violent property crime indicates unified logistics, getaway corridors, and shared fencing territory."
                )
            elif len(group) == 2:
                title = f"{city_label} Dual-Point Tactical Corridor"
                narrative = (
                    f"Direct spatial proximity between 2 active investigation scenes within {cluster_radius} km. "
                    f"Spans {', '.join(firs)}. Tactical telemetry suggests rapid transit or localized operational staging."
                )
            else:
                title = f"{pt.label} ({city_label} Point)"
                narrative = f"Isolated crime scene/infrastructure node mapped in {city_label} under {pt.fir_number} ({pt.crime_category})."

            clusters.append(GeoCrimeCluster(
                cluster_id=f"GEO-HOTSPOT-{cluster_idx:02d}",
                cluster_title=title,
                center_latitude=round(avg_lat, 5),
                center_longitude=round(avg_lng, 5),
                radius_km=cluster_radius,
                location_count=len(group),
                locations=group,
                dominant_crime_category=dom_cat,
                risk_severity=sev,
                gang_territory_analysis=narrative,
                associated_firs=firs
            ))
            cluster_idx += 1

        # Sort clusters by location count descending (hotspots first)
        clusters.sort(key=lambda c: c.location_count, reverse=True)

        regions = list(set(p.state for p in points))

        return GeoClustersResponse(
            total_locations_mapped=len(points),
            total_hotspots_detected=len([c for c in clusters if c.location_count >= 2]),
            locations=points,
            clusters=clusters,
            regional_coverage=regions
        )

geo_service = GeoSpatialService()
