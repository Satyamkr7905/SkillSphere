from __future__ import annotations

from functools import lru_cache

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

_st_model = None


def _try_sentence_transformer():
    global _st_model
    if _st_model is False:
        return None
    if _st_model is not None:
        return _st_model
    try:
        from sentence_transformers import SentenceTransformer

        _st_model = SentenceTransformer("all-MiniLM-L6-v2")
        return _st_model
    except Exception:
        _st_model = False
        return None


@lru_cache(maxsize=1)
def _tfidf():
    return TfidfVectorizer(ngram_range=(1, 2), min_df=1)


def embed_texts(texts: list[str]) -> np.ndarray:
    """Sentence Transformers when available; TF-IDF otherwise so the API boots without a GPU."""
    model = _try_sentence_transformer()
    if model is not None:
        return np.array(model.encode(texts, normalize_embeddings=True))
    vec = _tfidf()
    matrix = vec.fit_transform(texts)
    dense = matrix.toarray()
    norms = np.linalg.norm(dense, axis=1, keepdims=True)
    norms[norms == 0] = 1
    return dense / norms


def pairwise_similarity(a: str, b: str) -> float:
    vectors = embed_texts([a, b])
    return float(cosine_similarity([vectors[0]], [vectors[1]])[0][0])
