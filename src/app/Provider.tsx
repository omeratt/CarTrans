"use client";
import { Provider } from "react-redux";
import store, { persistor } from "../../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import { MyContextProvider } from "./ContextProvider";
import { Toaster } from "react-hot-toast";
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThirdwebProvider activeChain={ChainId.Mumbai}>
          {children}
          <Toaster />
        </ThirdwebProvider>
      </PersistGate>
    </Provider>
  );
}
export default Providers;
