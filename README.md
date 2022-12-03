# React-Tezos-Unity-Webgl-Boilerplate
this project helps to create web games using unity tezos and react,react create connects with unity being able to send and receive data.
![Captura de tela 2022-12-03 181932](https://user-images.githubusercontent.com/52639395/205462941-e7035215-2ff8-48e1-8ccf-e84a9919de21.png)
![Captura de tela 2022-12-03 182423](https://user-images.githubusercontent.com/52639395/205462940-c4eb54d7-2957-4378-bdd4-b701d5bb9c5f.png)
# How this works
React has pre-built functions that Unity can call
### React typescript/javascript
```tsx 
const connectWallet = useWalletConnect();
const handleConnectTezosWallet = useCallback(async () => {
     await connectWallet();
  }, [isLoaded,userAddress]);
  useEffect(() => {
      addEventListener("ConnectTezosWallet", handleConnectTezosWallet);
      return () => {
        removeEventListener("ConnectTezosWallet", handleConnectTezosWallet);
    }
  }, [isLoaded,contract]);
```
### Unity csharp
```Csharp
[DllImport("__Internal")]
public static extern void ConnectTezosWallet();
```
