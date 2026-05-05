from fastapi import HTTPException

from services.auth_service import AuthService


def test_hash_and_verify_password_round_trip():
    hashed = AuthService.hash_password('password123')
    assert hashed != 'password123'
    assert AuthService.verify_password('password123', hashed)


def test_decode_token_rejects_invalid_token():
    try:
        AuthService.decode_token('invalid.token')
        assert False, 'Expected decode_token to raise'
    except HTTPException as exc:
        assert exc.status_code == 401
