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
### Example: Connect using Unity
```Csharp
Tezos.Wallet.ConnectTezosWallet();
```
### Example: Disconnect using Unity
```Csharp
Tezos.Wallet.DisconnectTezosWallet();
```
# Custom Contract
The first part is to create a filet type ```.jslib``` in ```Plugin``` folder to talk to unity to react
```js
mergeInto(LibraryManager.library, {
    IncrementContract: function () {
        try {
            window.dispatchReactUnityEvent("IncrementContract");
        } catch (e) {
            console.warn("Failed to dispatch event");
        }
    },
    DecrementContract: function () {
        try {
            window.dispatchReactUnityEvent("DecrementContract");
        } catch (e) {
            console.warn("Failed to dispatch event");
        }
    },
});
```
The part of Csharp that will call the function in jslib which in turn will call in react.
```cs
     [DllImport("__Internal")]
     private static extern void IncrementContract();

     [DllImport("__Internal")]
     private static extern void DecrementContract();
     
```
The function in react that will receive unity events
```jsx
const increment = async (): Promise<void> => {
    console.log(contract)
    setLoadingIncrement(true);
    try {
      const op = await contract.methods.increment(1).send();
      await op.confirmation();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(newStorage.toNumber());
      setUserBalance(await Tezos.tz.getBalance(userAddress));
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingIncrement(false);
    }
  };

  
  const decrement = async (): Promise<void> => {
    setLoadingDecrement(true);
    try {
      const op = await contract.methods.decrement(1).send();
      await op.confirmation();
      const newStorage: any = await contract.storage();
      if (newStorage) setStorage(newStorage.toNumber());
      setUserBalance(await Tezos.tz.getBalance(userAddress) );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingDecrement(false);
    }
  };

```
### for more information i recommend
- [Local jslib]()
- [Local React]()
- [Local Unity]()
- [Unity Webgl](https://docs.unity3d.com/Manual/webgl-interactingwithbrowserscripting.html)
- [tezos taquito](https://tezostaquito.io/)
