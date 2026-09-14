from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql://skillsphere:skillsphere@localhost:5432/skillsphere"
    neo4j_uri: str = "bolt://localhost:7687"
    neo4j_user: str = "neo4j"
    neo4j_password: str = "skillsphere"
    cors_origins: str = "http://localhost:5173,http://localhost:8080"
    llm_api_url: str = ""
    llm_api_key: str = ""
    seed_on_startup: bool = True

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()
