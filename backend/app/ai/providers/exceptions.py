class AIProviderError(Exception):
    def __init__(self, message: str, provider: str = "unknown"):
        self.message = message
        self.provider = provider
        super().__init__(message)


class AIProviderQuotaError(AIProviderError):
    pass


class AIProviderAuthError(AIProviderError):
    pass
