from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.settings import settings

app = FastAPI(
    title="BIRD API",
    version="0.1.0",
    summary="Decision-first API for Twitcher Mode.",
    description=(
        "BIRD is a birding decision and planning system. "
        "This API exposes the v0.1 Twitcher Mode workbench snapshot and core domain resources."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/", tags=["meta"])
def read_root() -> dict[str, str]:
    return {
        "name": "BIRD API",
        "mode": "Twitcher Mode",
        "version": "0.1.0",
        "docs": "/docs",
    }

