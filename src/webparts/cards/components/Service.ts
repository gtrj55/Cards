import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Context } from "react";

export class ServiceOperations{
    public getNews(context:WebPartContext):Promise<any>{
        let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbytitle('Site Pages')/items?$filter=PromotedState eq 2&$select=Title,BannerImageUrl,FileRef&$orderby=Modified desc&$top=3";
        //let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbytitle('News')/items?$filter=Visible eq 1&$orderby=Index asc&$top=3";
        return new Promise<any>(async(resolve,reject)=>{
            context.spHttpClient.get(newsURL,SPHttpClient.configurations.v1,{}).then((response:SPHttpClientResponse)=>{
                response.json().then(result=>{
                    return resolve(result.value);
                });
            });
        });        
    }

    public getArtifacts(context:WebPartContext):Promise<any>{
        let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbytitle('Artifacts')/items?$filter=Visible eq 1&$orderby=Index asc&$top=3";
        return new Promise<any>(async(resolve,reject)=>{
            context.spHttpClient.get(newsURL,SPHttpClient.configurations.v1,{}).then((response:SPHttpClientResponse)=>{
                response.json().then(result=>{
                    return resolve(result.value);
                });
            });
        });        
    }

    public getCompanyUpdates(context:WebPartContext):Promise<any>{
        let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbytitle('Company Updates')/items?$filter=Visible eq 1&$orderby=Index asc&$top=3";
        return new Promise<any>(async(resolve,reject)=>{
            context.spHttpClient.get(newsURL,SPHttpClient.configurations.v1,{}).then((response:SPHttpClientResponse)=>{
                response.json().then(result=>{
                    return resolve(result.value);
                });
            });
        });        
    }

    public getConfigurationList(context:WebPartContext):Promise<any>{
        let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbytitle('ConfigurationList')/items";
        return new Promise<any>(async(resolve,reject)=>{
            context.spHttpClient.get(newsURL,SPHttpClient.configurations.v1,{}).then((response:SPHttpClientResponse)=>{
                response.json().then(result=>{
                    return resolve(result.value);
                }).catch(error=>console.log(error));
            }).catch(error=>console.log(error));
        });       
    }
    public getOtherList(context:WebPartContext):Promise<any>{
        let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbyid('%7B0a81e092-7adb-4350-b423-87694d5e56aa%7D')/items?$filter=Visible eq 1&$orderby=Index asc"; // Change for Development and production
        //let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbyTitle('Others')/items?$filter=Visible eq 1&$orderby=Index asc"; // Change for Development and production
        return new Promise<any>(async(resolve,reject)=>{
            context.spHttpClient.get(newsURL,SPHttpClient.configurations.v1,{}).then((response:SPHttpClientResponse)=>{
                response.json().then(result=>{
                    return resolve(result.value);
                }).catch(error=>console.log(error + "Other"));
            }).catch(error=>console.log(error + "Other"));
        });       
    }
    public getBreakingNewsList(context:WebPartContext):Promise<any>{
        //let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbyid('%7B0a81e092-7adb-4350-b423-87694d5e56aa%7D')/items?$filter=Visible eq 1&$orderby=Index asc"; // Change for Development and production
        let newsURL:string=context.pageContext.web.absoluteUrl+"/_api/web/lists/getbyTitle('BreakingNews')/items?$top=1"; // Change for Development and production
        return new Promise<any>(async(resolve,reject)=>{
            context.spHttpClient.get(newsURL,SPHttpClient.configurations.v1,{}).then((response:SPHttpClientResponse)=>{
                response.json().then(result=>{
                    return resolve(result.value);
                }).catch(error=>console.log(error + "Breaking News"));
            }).catch(error=>console.log(error + "Breaking News"));
        });       
    }
}