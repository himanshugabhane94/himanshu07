import time
import traceback
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.api import auth, cases, graph, analytics, ingestion, blockchain, reports, scenarios, cross_case
from app.services.seed_data import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize seed database on startup
    seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade AI-powered criminal network analytics, graph AI intelligence, and blockchain-backed chain of custody system for Ministry of Home Affairs (SIH26189).",
    lifespan=lifespan
)

# Global Request Logging & Error Interceptor Middleware
@app.middleware("http")
async def request_logger_middleware(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000, 2)
        print(f"[{request.method}] {request.url.path} -> {response.status_code} ({duration_ms}ms)")
        return response
    except Exception as exc:
        duration_ms = round((time.time() - start_time) * 1000, 2)
        print(f"[UNHANDLED ERROR] {request.method} {request.url.path} ({duration_ms}ms): {str(exc)}")
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={
                "detail": f"Internal Server Error: {str(exc)}",
                "error_type": type(exc).__name__,
                "path": request.url.path
            }
        )

# Custom Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "path": request.url.path}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"[VALIDATION ERROR] {request.method} {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Request validation failed", "errors": exc.errors(), "path": request.url.path}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[GLOBAL EXCEPTION] {request.method} {request.url.path}: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={
            "detail": f"Internal Server Error: {str(exc)}",
            "error_type": type(exc).__name__,
            "path": request.url.path
        }
    )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(graph.router, prefix=settings.API_V1_STR)
app.include_router(analytics.router, prefix=settings.API_V1_STR)
app.include_router(ingestion.router, prefix=settings.API_V1_STR)
app.include_router(blockchain.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(scenarios.router, prefix=settings.API_V1_STR)
app.include_router(cross_case.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "system": "CrimeNet — AI-Powered Criminal Network Analysis System",
        "version": settings.VERSION,
        "project": "Ministry of Home Affairs (SIH26189)",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }
