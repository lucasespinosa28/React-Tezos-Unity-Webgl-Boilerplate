mergeInto(LibraryManager.library, {
    ConnectTezosWallet: function () {
        try {
            window.dispatchReactUnityEvent("ConnectTezosWallet");
        } catch (e) {
            console.warn("Failed to dispatch event");
        }
    },
    DisconnectTezosWallet: function () {
        try {
            window.dispatchReactUnityEvent("DisconnectTezosWallet");
        } catch (e) {
            console.warn("Failed to dispatch event");
        }
    },
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