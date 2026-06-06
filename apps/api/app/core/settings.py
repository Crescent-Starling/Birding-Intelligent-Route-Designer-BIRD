from dataclasses import dataclass, field
import os


@dataclass(slots=True)
class Settings:
    release_channel: str = os.getenv("BIRD_RELEASE_CHANNEL", "v0.1-prototype")
    cors_origins: list[str] = field(
        default_factory=lambda: [
            "http://127.0.0.1:3000",
            "http://localhost:3000",
        ]
    )


settings = Settings()

