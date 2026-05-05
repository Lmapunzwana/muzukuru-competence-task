def test_authenticated_todo_journey(client, auth_headers):
    create = client.post('/todos', json={'title': 'Write tests'}, headers=auth_headers)
    assert create.status_code == 201
    todo = create.json()
    assert todo['title'] == 'Write tests'
    assert todo['completed'] is False

    list_resp = client.get('/todos', headers=auth_headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) == 1

    updated = client.patch(f"/todos/{todo['id']}", json={'completed': True}, headers=auth_headers)
    assert updated.status_code == 200
    assert updated.json()['completed'] is True

    deleted = client.delete(f"/todos/{todo['id']}", headers=auth_headers)
    assert deleted.status_code == 204

    final_list = client.get('/todos', headers=auth_headers)
    assert final_list.json() == []


def test_todos_requires_auth(client):
    resp = client.get('/todos')
    assert resp.status_code == 401
