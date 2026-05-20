import { useEffect } from "react";
import { AppState } from "react-native";
import * as SecureStore from 'expo-secure-store';

let hasStarted = false;


export default function useAppState(clearCredentials: ()=>Promise<boolean>) {
    
    useEffect(() => {
        const sub = AppState.addEventListener("change", async (state) => {
            //console.log("[APP STATE] →", state);
            try{
                if (state === "background") {
                    // Mark clean close
                    //console.log("App going to background → saving cleanClose");
                    //console.log("TIME OF BACKGROUND → ", String(Date.now()));
                    await SecureStore.setItemAsync("lastBackground", String(Date.now()));
                    await SecureStore.setItemAsync("cleanClose", "yes");
                }
            }catch(e) {
                console.warn("AppState background handler error:", e);
            }
            });
        return () => sub.remove();
    }, []);
    
        // On app launch
    useEffect(() => {
    (async () => {
        //console.log('Something...');
        try{
            if (hasStarted) {
            //console.log("[INFO] Not a cold start -> navigation remount");
            return;
            }
            hasStarted = true; // mark that we've already initialized

            const currentTime = Date.now();
            //console.log("[INFO] Cold start → check cleanClose");
            
            const cleanClose = await SecureStore.getItemAsync("cleanClose");
            const lastBackground = await SecureStore.getItemAsync("lastBackground");
            //console.log("[LAUNCH] cleanClose flag: ", cleanClose);

            const timeElapsed = currentTime - Number(lastBackground);

            if (!cleanClose) {
                //console.log("[LAUNCH] No cleanClose → FORCE LOGOUT (App was killed)");
                // App was force-closed (swiped)
                await clearCredentials();
            } 
            else if(timeElapsed > 0){
                //console.log("[LAUNCH] Max time has passed → FORCE LOGOUT (App was killed)");
                await clearCredentials();
            } 
            else {
                //console.log("[TIME] time elapsed was", currentTime - Number(lastBackground));
                //console.log("[LAUNCH] cleanClose detected → Keep user logged in");
            }

            // Reset for next launch
            await SecureStore.deleteItemAsync("cleanClose");
            await SecureStore.deleteItemAsync("lastBackground");
            //console.log("[LAUNCH] cleanClose flag RESET");

            }catch(e) {
                console.warn("Cold Start error. ", e);
            }
    })();
    }, []);

}