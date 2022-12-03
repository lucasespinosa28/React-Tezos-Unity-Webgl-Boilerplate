using System.Runtime.InteropServices;
using JetBrains.Annotations;
using UnityEngine;

namespace Tezos
{
    public class Wallet : MonoBehaviour
    {
        [DllImport("__Internal")]
        public static extern void ConnectTezosWallet();
        [DllImport("__Internal")]
        public static extern void DisconnectTezosWallet();
        public static int Status = 0;
        [CanBeNull] public static string Address = null;
        [CanBeNull] public static string Contract = null;
        public void SetStatus(int value)
        {
            Debug.Log($"status: {Status.ToString()}");
            if (value == 1)
            {
                Status = 1;
            }
        }
        public void SetAddress(string value)
        {
            Address = value;
        }
        public void SetContract(string value)
        {
            Contract = value;
        }
    }
}