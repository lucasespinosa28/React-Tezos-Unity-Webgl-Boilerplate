import React, {useCallback, useEffect, useState} from "react";
import {TezosToolkit} from "@taquito/taquito";
import {BeaconWallet} from "@taquito/beacon-wallet";
import {BeaconEvent, defaultEventCallbacks, NetworkType} from "@airgap/beacon-dapp";
import {Unity, useUnityContext} from "react-unity-webgl";
import "./App.css";

const App = () => {
  const { unityProvider , sendMessage, isLoaded, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "Build/tezos.loader.js",
    dataUrl: "Build/tezos.data",
    frameworkUrl: "Build/tezos.framework.js",
    codeUrl: "Build/tezos.wasm",
  });
  
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.ecadinfra.com")
  );
  const [loadingIncrement, setLoadingIncrement] = useState<boolean>(false);
  const [loadingDecrement, setLoadingDecrement] = useState<boolean>(false);
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<any>(0);
  const [storage, setStorage] = useState<number>(0);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  // Ghostnet Increment/Decrement contract
  const contractAddress: string = "KT1QMGSLynvwwSfGbaiJ8gzWHibTCweCGcu8";
  const setup = async (userAddress: string): Promise<void> => {
    setUserAddress(userAddress);
    // updates balance
    const balance = await Tezos.tz.getBalance(userAddress);
    setUserBalance(balance.toNumber());
    // creates contract instance
    const contract = await Tezos.wallet.at(contractAddress);
    const storage: any = await contract.storage();
    setContract(contract);
    setStorage(storage.toNumber());
  };
  useEffect(() => {
      (async () => {
        // creates a wallet instance
        const wallet = new BeaconWallet({
          name: "Taquito React template",
          preferredNetwork: NetworkType.GHOSTNET,
          disableDefaultEvents: true, // Disable all events / UI. This also disables the pairing alert.
          eventHandlers: {
            // To keep the pairing alert, we have to add the following default event handlers back
            [BeaconEvent.PAIR_INIT]: {
              handler: defaultEventCallbacks.PAIR_INIT
            },
            [BeaconEvent.PAIR_SUCCESS]: {
              handler: data => setPublicToken(data.publicKey)
            }
          }
        });
        Tezos.setWalletProvider(wallet);
        setWallet(wallet);
        // checks if wallet was connected before
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount) {
          const userAddress = await wallet.getPKH();
          await setup(userAddress);
          setBeaconConnection(true);
        }
      })();
  }, []);
 
  function useWalletConnect() {
    return async (): Promise<void> => {
      try {
        await wallet.requestPermissions({
          network: {
            type: NetworkType.GHOSTNET,
            rpcUrl: "https://ghostnet.ecadinfra.com"
          }
        });
        // gets user's address
        const userAddress = await wallet.getPKH();
        await setup(userAddress);
        setBeaconConnection(true);
      } catch (error) {
        console.log(error);
      }
    };
  }

  const connectWallet = useWalletConnect();

  function useDisconnectWallet() {
    return async (): Promise<void> => {
      if (wallet) {
        await wallet.clearActiveAccount();
      }
      setUserAddress("");
      setUserBalance(0);
      setWallet(null);
      const tezosTK = new TezosToolkit("https://ghostnet.ecadinfra.com");
      setTezos(tezosTK);
      setBeaconConnection(false);
      setPublicToken(null);
    };
  }

  const disconnectWallet = useDisconnectWallet();
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
  useEffect(() => {
    if(userAddress && isLoaded){
      sendMessage("Wallet", "SetAddress", userAddress);
      sendMessage("Wallet", "SetContract", contractAddress);
    }
  },[userAddress])
  useEffect(() => {
    if(userBalance && isLoaded){
      sendMessage("Wallet", "setBalance", ((userBalance / 1000000).toLocaleString("en-US")+"ꜩ"));
    }
  },[userBalance])

  useEffect(() => {
    if(storage && isLoaded){
      sendMessage("Wallet", "SetContractStorage", storage);
    }
  },[storage])
  
  useEffect(() => {
    if(userAddress && isLoaded){
      sendMessage("Wallet", "SetStatus", 1);
    }
  },[userAddress])
  
  const handleConnectTezosWallet = useCallback(async () => {
     await connectWallet();
  }, [isLoaded,userAddress]);
  useEffect(() => {
      addEventListener("ConnectTezosWallet", handleConnectTezosWallet);
      return () => {
        removeEventListener("ConnectTezosWallet", handleConnectTezosWallet);
    }
  }, [isLoaded,contract]);
 
  const handleDisconnectTezosWallet = useCallback(async () => {
    await disconnectWallet();
  }, [isLoaded,userAddress]);
  useEffect(() => {
    addEventListener("DisconnectTezosWallet", handleDisconnectTezosWallet);
    return () => {
      removeEventListener("DisconnectTezosWallet", handleDisconnectTezosWallet);
    }
  }, [isLoaded,userAddress]);

  const handleIncrementContract = useCallback(async () => {
    await increment();
  }, [contract]);
  useEffect(() => {
    addEventListener("IncrementContract", handleIncrementContract);
    return () => {
      removeEventListener("IncrementContract", handleIncrementContract);
    }
  }, [contract]);

  const handleDecrementContract = useCallback(async () => {
    await decrement();
  }, [contract]);
  useEffect(() => {
    addEventListener("DecrementContract", handleDecrementContract);
    return () => {
      removeEventListener("DecrementContract", handleDecrementContract);
    }
  }, [contract]);

  useEffect(() => {
    if(userAddress && isLoaded){
      sendMessage("Wallet", "setLoadingIncrement", loadingIncrement?1:0);
    }
  },[loadingIncrement])
  useEffect(() => {
    if(userAddress && isLoaded){
      sendMessage("Wallet", "setLoadingDecrement", loadingDecrement?1:0);
    }
  },[loadingDecrement])
  return (
    <div className="main-box">
      <h1>React Tezos Unity Webgl</h1>
        <Unity style={{ width: "960px", height: "600px" } } unityProvider={unityProvider} />
    </div>
  )
};

export default App;
