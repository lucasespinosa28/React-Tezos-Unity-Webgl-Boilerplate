using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using UnityEngine;

public class Game : MonoBehaviour
{
    // Start is called before the first frame update
    [SerializeField] public GameObject bird;
    private int _birdsNumber = 0;
    void Start()
    {
    }

    void Generator()
    {
        if (_birdsNumber != 0)
        {
            for (int i = 0; i <= _birdsNumber; i++)
            {
                Debug.Log(_birdsNumber);
                Destroy(GameObject.Find($"Bird{i}"));
            }
        }
        for (int i = 0; i < 2; i++)
        {
            var position = new Vector2(Random.Range(-8.25f, 8.26f), Random.Range(-4.52f, 4.52f));
            Instantiate(bird, position, Quaternion.identity).name = $"Bird{i}";
            _birdsNumber = i;
        }
    }
    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyUp(KeyCode.Space))
        {
            Generator();
        }
    }
}
