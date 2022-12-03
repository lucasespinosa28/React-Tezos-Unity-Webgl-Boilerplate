using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Move : MonoBehaviour
{
    private float _moveSpeed;
    private SpriteRenderer _sprite;
    private float _direction;
    private Camera _camera;

    private Vector2 _fear;
    // Start is called before the first frame update
    void Start()
    {
        _sprite = gameObject.GetComponent<SpriteRenderer>();
        _direction = transform.position.x;
        _moveSpeed = Random.Range(1f, 5f);
        _fear = new Vector2(Random.Range(-0.5f, 0.5f),Random.Range(-0.5f, 0.5f));
        _camera = Camera.main;
    }

    // Update is called once per frame
    void Update()
    {

        if (gameObject.transform.position.x > _direction)
        {
            _sprite.flipX = true;
           _direction = gameObject.transform.position.x;
        }
        if (gameObject.transform.position.x < _direction)
        {
            _sprite.flipX = false;
            _direction = gameObject.transform.position.x;
        }

        Vector2 mousePosition = _camera.ScreenToWorldPoint(Input.mousePosition);
        transform.position = Vector2.MoveTowards(transform.position, mousePosition + _fear, _moveSpeed * Time.deltaTime);
        
    }
}
