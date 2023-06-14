import { Masa } from "@masa-finance/masa-sdk";
import { providers } from "ethers";

// with metamask
export const MasaIntegration = () => {
    try {
        const provider = new providers.Web3Provider(window.celo);
        window.celo.enable()
        const signer = provider.getSigner();

    return new Masa({
    signer,
    }); 
} catch (err) {
    console.log(err)
}
   
}



export const LoginWithMasa = async () => {
    try {
    const masa  =   MasaIntegration()
    const connect = await masa.session.login()
    console.log(connect.address)
    
    const identity = await masa.identity.createWithSoulName("CELO", "glory", 20000)
    // console.log(identity)
        const account = await masa?.soulName.resolve("0xFa31f1b8CbC9A0310Dff7F8bedD33BA8Aab44372")
        console.log(account)
        window.location.reload()
    } catch (error) {
        console.log(error)
    }
}

export const checkMasaLogin = async () => {
    try {
        const masa: any = MasaIntegration()
    return await masa.session.checkLogin() 
    } catch (error) {
        console.log(error)
    }
}

export const logOut = async () => {
    const masa: any =   MasaIntegration()
    const signout = await masa.session.logout()
    console.log(signout)
    window.location.reload()
}