import { Masa } from "@masa-finance/masa-sdk";
import { providers } from "ethers";
import { resolve } from "path";

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
    console.log(connect?.address)
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

 export const masaConnectedAccount = async () => {
    const masa = MasaIntegration()
    console.log(await masa?.config.signer.getAddress())
    return await masa?.config.signer.getAddress()
 }
  
export const createSoulName = async (soulName : string) => {       
    const identity = await masa.identity.createWithSoulName("CELO", soulName, 20000)
    return identity
}
 
export const resolveDomain = async (address : string) => {
    const account = await masa?.soulName.resolve(address)
    return account
}