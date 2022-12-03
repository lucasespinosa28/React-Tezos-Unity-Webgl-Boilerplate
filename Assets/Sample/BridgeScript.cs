using System;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.UIElements;
using Random = UnityEngine.Random;

namespace Sample
{
    public class BridgeScript : MonoBehaviour
    {

        [DllImport("__Internal")]
        private static extern void IncrementContract();

        [DllImport("__Internal")]
        private static extern void DecrementContract();

        private Label _labelAddress;
        private Label _labelContract;
        private Label _labelBirds;
        private Button _connectButton;
        private Button _disconnectButton;
        private Button _incrementButton;
        private Button _decrementButton;
        [SerializeField] public GameObject bird;
        private int _birdsNumber = 0;

        void Start()
        {
            var root = gameObject.GetComponent<UIDocument>().rootVisualElement;
            _labelAddress = root.Q<Label>("LabelAddress");
            _labelContract = root.Q<Label>("LabelContract");
            _labelBirds = root.Q<Label>("LabelBirds");
            _connectButton = root.Q<Button>("ConnectButton");
            _connectButton.RegisterCallback<ClickEvent>(ConnectEvent);
            _disconnectButton = root.Q<Button>("DisconnectButton");
            _disconnectButton.RegisterCallback<ClickEvent>(DisconnectEvent);

            _incrementButton = root.Q<Button>("IncrementButton");
            _incrementButton.RegisterCallback<ClickEvent>((evt) => { IncrementContract(); });
            _decrementButton = root.Q<Button>("DecrementButton");
            _decrementButton.RegisterCallback<ClickEvent>((evt) => { DecrementContract(); });
            
            _connectButton.AddToClassList("Show");
            _disconnectButton.AddToClassList("Hidden");
        }

        public void ConnectEvent(ClickEvent evt)
        {
            Tezos.Wallet.ConnectTezosWallet();
        }

        public void DisconnectEvent(ClickEvent evt)
        {
            Tezos.Wallet.DisconnectTezosWallet();
            Tezos.Wallet.Address = null;
        }

        public void setLoadingIncrement(int value)
        {
            if (value == 1)
            {
                _incrementButton.text = "Please wait";
            }
            else
            {
                _incrementButton.text = "Increment by 1";
            }
        }

        public void setLoadingDecrement(int value)
        {
            if (value == 1)
            {
                _decrementButton.text = "Please wait";
            }
            else
            {
                _decrementButton.text = "Decrement by 1";
            }

        }
        
        void Generator(int value)
        {
            if (_birdsNumber != 0)
            {
                for (int i = 0; i <= _birdsNumber; i++)
                {
                    Destroy(GameObject.Find($"Bird{i}"));
                }
            }

            for (int i = 0; i <= value; i++)
            {
                var position = new Vector2(Random.Range(-8.25f, 8.26f), Random.Range(-4.52f, 4.52f));
                Instantiate(bird, position, Quaternion.identity).name = $"Bird{i}";
                _birdsNumber = i;
            }
        }

        public void SetContractStorage(int value)
        {
            _labelBirds.text = $"Number of Birds: {value.ToString()}";
            Generator(value);
        }

        private void Update()
        {
            if (Tezos.Wallet.Address == null)
            {
                _connectButton.RemoveFromClassList("Hidden");
                _disconnectButton.RemoveFromClassList("Show");
                
                _connectButton.AddToClassList("Show");
                _disconnectButton.AddToClassList("Hidden");
            }
            if (Tezos.Wallet.Address != null)
            {
                _labelAddress.text = $"Address: {Tezos.Wallet.Address }";
                
                _connectButton.RemoveFromClassList("Show");
                _disconnectButton.RemoveFromClassList("Hidden");
                
                _connectButton.AddToClassList("Hidden");
                _disconnectButton.AddToClassList("Show");
            }
            if (Tezos.Wallet.Contract != null)
            {
                _labelContract.text = $"Contract: {Tezos.Wallet.Contract}";
            }
        }
    }
}
