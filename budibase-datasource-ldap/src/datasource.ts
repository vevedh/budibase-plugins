import { IntegrationBase } from "@budibase/types"
import fetch from "node-fetch"
import { Client } from 'ldapts';
interface AdLdapConfig  {
  url: string
  bindDN: string
  secret: string
  baseDN: string
}

class AdLdapIntegration implements IntegrationBase {
  private readonly config: AdLdapConfig
  private client:Client;
  

  constructor(config: AdLdapConfig) {
    this.config = config
    this.client = new Client({
      url: this.config.url,
      timeout: 0,
      connectTimeout: 0,
      /*tlsOptions: {
        minVersion: 'TLSv1.2',
      },*/
      strictDN: true
    })
  }


  


 
  async read(query: { filtre: string }) {
   
      
      console.log("Client crée :",this.client)
      
      
      var response = null;
      try {
        await this.client.bind(this.config.bindDN, this.config.secret)
        if (this.client.isConnected) {
          console.log("Client ldap connecté")
        } else {
          console.log("Client ldap Non connecté")
        }
      
        const { searchEntries, searchReferences } = await this.client.search(this.config.baseDN, {
          scope: 'sub',
          filter: (!query.filtre||(query.filtre==''))?'(&(objectCategory=person)(objectClass=user)(mail=*)(sAMAccountName=*))':`${query.filtre}`,
        })
        response = JSON.stringify(searchEntries)
       
      } catch (ex) {
        throw new Error(`AD Ldap error: ${ex}`)
      } finally {
        await this.client.unbind()
      }
    
    
    
    return response
  
  }
}

export default AdLdapIntegration
