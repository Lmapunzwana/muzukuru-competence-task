def test_register_and_login_flow(client):
    register = client.post('/register', json={'email': 'bob@example.com', 'password': 'password123'})
    assert register.status_code == 201
    assert register.json()['email'] == 'bob@example.com'

    login = client.post('/login', json={'email': 'bob@example.com', 'password': 'password123'})
    assert login.status_code == 200
    assert 'access_token' in login.json()


def test_register_conflict(client):
    client.post('/register', json={'email': 'duplicate@example.com', 'password': 'password123'})
    second = client.post('/register', json={'email': 'duplicate@example.com', 'password': 'password123'})
    assert second.status_code == 409
