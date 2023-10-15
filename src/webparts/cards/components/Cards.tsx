import * as React from 'react';
//import styles from './Cards.module.scss';
import { ICardsProps } from './ICardsProps';
import { ICardsState } from './ICardsState';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader';
require('./Style.css');
//import * as $ from 'jquery';
import 'jqueryui';
import { ServiceOperations } from './Service';
import Marquee from "react-fast-marquee";
// import { MarqueeSelection } from 'office-ui-fabric-react';
export default class Cards extends React.Component<ICardsProps, ICardsState, {}> {
  public SerOps: ServiceOperations;
  public SiteUrl: string;
  constructor(props:any) {
    super(props);
    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    this.SerOps = new ServiceOperations();
    this.state = {
      artifacts: [],
      companyUpdates: [],
      news: [],
      Configuration: [],
      OtherList: [],
      LinkList: [],
      loading: false,
      BreakingNewList: [],
      toDate:null,
      fromDate:null,
      URL1:null,
      URL2:null
    };
    this.SiteUrl = this.props.context.pageContext.web.absoluteUrl;
  }
  makingString=(result:any)=>{
    var url = null;
    if(result[0].Description.indexOf("{{URL1}}")>-1 && result[0].URLDescription1)
      url = result[0].Description.replace("{{URL1}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription1.Url+"'>"+result[0].URLDescription1.Description+"</a>");
      
    
    if(result[0].Description.indexOf("{{URL2}}")>-1 && result[0].URLDescription2 && url != null)
    url = url.replace("{{URL2}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription2.Url+"'>"+result[0].URLDescription2.Description+"</a>");
    else if (result[0].Description.indexOf("{{URL2}}")>-1 && result[0].URLDescription2 && url == null)
    url = result[0].Description.replace("{{URL2}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription2.Url+"'>"+result[0].URLDescription2.Description+"</a>");

    if(result[0].Description.indexOf("{{URL3}}")>-1 && result[0].URLDescription3 && url != null)
    url = url.replace("{{URL3}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription3.Url+"'>"+result[0].URLDescription3.Description+"</a>");
    else if (result[0].Description.indexOf("{{URL3}}")>-1 && result[0].URLDescription3 && url == null)
    url = result[0].Description.replace("{{URL3}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription3.Url+"'>"+result[0].URLDescription3.Description+"</a>");

    if(result[0].Description.indexOf("{{URL4}}")>-1 && result[0].URLDescription4 && url != null)
    url = url.replace("{{URL4}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription4.Url+"'>"+result[0].URLDescription4.Description+"</a>");
    else if (result[0].Description.indexOf("{{URL4}}")>-1 && result[0].URLDescription4 && url == null)
    url = result[0].Description.replace("{{URL4}}", "<a target='_blank' data-interception='off' href='"+result[0].URLDescription4.Url+"'>"+result[0].URLDescription4.Description+"</a>");


    if(result[0].Description.indexOf("{{URL1}}")==-1 && result[0].Description.indexOf("{{URL2}}")==-1 && result[0].Description.indexOf("{{URL3}}")==-1 && result[0].Description.indexOf("{{URL4}}")==-1)
    url = result[0].Description
    
    url = url!=null?url.replaceAll("[Point]", '<i class="fa-sharp fa-solid fa-angles-right"></i>'):null;
    return url
  }
  componentDidMount() {
    Promise.all([this.SerOps.getNews(this.props.context), this.SerOps.getArtifacts(this.props.context), this.SerOps.getCompanyUpdates(this.props.context), this.SerOps.getConfigurationList(this.props.context), this.SerOps.getOtherList(this.props.context), this.SerOps.getBreakingNewsList(this.props.context)]).then(result => {
      this.setState({
        news: result[0].map((item:any) => ({ ...item, FileRef: item.FileRef.replace("/sites/Waves", "") })), // for Dev need to change the line
        //news: result[0].map((item:any) => ({ ...item, FileRef: item.FileRef.replace("sites/StellantWaves", "") })), // for Dev need to change the line
        artifacts: result[1],
        companyUpdates: result[2],
        Configuration: result[3],
        OtherList: result[4].filter((item:any) => item.Position == "Header"),
        LinkList: result[4].filter((item:any) => item.Position == "Link"),
        BreakingNewList: result[5],
        URL1:this.makingString(result[5]),        
        toDate:result[5].length>0?result[5][0].To:null
      });
    });

  }
  
  public render(): React.ReactElement<ICardsProps> {
    
    const toDate = this.state.BreakingNewList.length > 0 ? this.state.BreakingNewList[0].To:"";
    return (
      this.state.loading ?
        <div className='LaodingMain'>
          <div className="centerLoader">
            <div className="ring"></div>
            <span className='loadingSpan'>
              loading...
            </span>
          </div>
        </div> :
        <div className="MainContainer">

          <div className="RightContainer">
            <div className="CEODeskClassMain">
              <div className="TextSection marginAuto">

                <img src={this.SiteUrl + "/SiteAssets/Images/shape%20(1).png"} />
                <div>
                  <p className="PremovePaddingFromBottom whiteColor">From the</p>
                  <h4 className="PremovePaddingFromTop whiteColor"> CEO Desk</h4>
                </div>
              </div>
              <div className="VideoSection marginAuto">
                <div className="NewsContainerClass flexCss">
                  {/* <div className="PositionRelative marginright10"> */}
                  {this.state.OtherList.map((otherItem, index) => {
                    return <div className={index == 0 ? "PositionRelative marginright10" : "PositionRelative"}>
                      <a href={otherItem.LinkToNavigate.Url} data-interception="off" target={otherItem.newTab ? "_blank" : "_self"}>
                        <div className="cardImagewithContent">
                          <img className="newsClass headerNewsClass" src={otherItem.ImageURL.Url} alt="" />
                          <div className="cardContent cardContentHeader">
                            <p></p>
                          </div>
                        </div></a>
                      {otherItem.Video ?
                        <a href={otherItem.LinkToNavigate.Url} data-interception="off" target={otherItem.newTab ? "_blank" : "_self"}>
                          <img src={this.SiteUrl + "/SiteAssets/Images/play-icon.svg"} className="Image-Icon" />
                        </a> : <></>}
                    </div>
                  })
                  }
                </div>
              </div>
            </div>
            {/* for new thing added in the page code */}
            {/* <div id="breaking-news-container">
            <div id="breaking-news-colour" className="slideup animated">
              
            </div>
             
            <span className="breaking-news-title delay-animated slidein">
            {this.state.BreakingNewList.length>0?this.state.BreakingNewList[0].Title:null}
              </span> 
              <a className="breaking-news-headline delay-animated2 fadein marquee" style={mystyle}>
              {this.state.BreakingNewList.length>0?this.state.BreakingNewList[0].Description:null}
              </a>  
          </div>   */}

            {/* end the new thing added code */}
            {/* <h1>hello Gautam</h1>
            <div className="news-container">
              <div className="title">
                Breaking News
              </div>

              <ul>
                <li>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam!
                </li>

                <li>
                  Lorem ipsum dolor sit
                </li>

                <li>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. ipsam!
                </li>
              </ul>
            </div> */}



            {/* <div className="onoffswitch3">
    <input type="checkbox" name="onoffswitch3" className="onoffswitch3-checkbox" id="myonoffswitch3" checked/>
    <label className="onoffswitch3-label" for="myonoffswitch3">
        <span className="onoffswitch3-inner">
            <span className="onoffswitch3-active">
                <marquee className="scroll-text">Gautam Rajput Tech  <span className="glyphicon glyphicon-forward"></span> Avengers: Infinity War's Iron Spider Suit May Use Bleeding Edge Tech  <span className="glyphicon glyphicon-forward"></span> Avengers: Infinity War's Iron Spider Suit May Use Bleeding Edge Tech  <span className="glyphicon glyphicon-forward"></span> Avengers: Infinity War's Iron Spider Suit May Use Bleeding Edge Tech  <span className="glyphicon glyphicon-forward"></span> Avengers: Infinity War's Iron Spider Suit May Use Bleeding Edge Tech </Marquee>
                <span className="onoffswitch3-switch">BREAKING NEWS <span className="glyphicon glyphicon-remove"></span></span>
            </span>
            <span className="onoffswitch3-inactive"><span className="onoffswitch3-switch">SHOW BREAKING NEWS</span></span>
        </span>
    </label>
</div> */}



{this.state.toDate != null && new Date(this.state.toDate).setHours(0,0,0,0) >= new Date().setHours(0,0,0,0)?
            <div className='BreakingNewsContainer'>
              <div className='BreakingNewsTitle'>
                {this.state.BreakingNewList.length > 0 ? this.state.BreakingNewList[0].Title : null}
              </div>
              <Marquee gradient={false} speed={this.state.BreakingNewList.length > 0 ? this.state.BreakingNewList[0].speed : 20} delay={0}>
                <div dangerouslySetInnerHTML={{__html: this.state.URL1}}>
                  {/* {this.state.BreakingNewList.length > 0 ? this.state.BreakingNewList[0].Description : null} */}
                  {/* {this.state.URL1} */}
                </div>
                <div>
                </div>
              </Marquee>
            </div>:<></>}




            

           {/* // this marquee code we can add for future but currently we use above marquee, so commented */}
           {/* <div className='BreakingNewsContainer1'>
           <div className='BreakingNewsTitle'>
                {this.state.BreakingNewList.length > 0 ? this.state.BreakingNewList[0].Title : null}
              </div>
              <div className="marquee">
              <div dangerouslySetInnerHTML={{__html: this.state.URL1}}>
                </div>
            </div>
           </div> */}
            
           {/* // finished marquee */}


           {/* this is middle links container/div */}
            <div className="imageLinksMiddle">
              {this.state.LinkList.map(item => {
                return item.newTab?<a className='middle-Navigation-image-anchor' href={item.LinkToNavigate.Url} data-interception="off" target="_blank"><img className='middle-Navigation-image' src={item.ImageURL.Url} alt="images" /></a> : <a className='middle-Navigation-image-anchor' onClick={()=>window.location.href=item.LinkToNavigate.Url} target="_self"><img className='middle-Navigation-image' src={item.ImageURL.Url} alt="images" /></a>;
              })}
            </div>
            {/* this is end of middle link container */}


            <div className="RightContainerMain">
              <div className="RightContainerLeft">
                <div className="NewsSeeAllClass">
                  <div>News Updates</div>
                  <a href={this.state.Configuration.length > 0 ? this.state.Configuration.filter(configAll => configAll.Title == "See All" && configAll.Category == "News")[0].LinkRelatedToItem.Url : ""} target="_blank" data-interception="off" className="href"><span>See All</span></a>
                </div>
                <div className="NewsContainerClass">
                  {this.state.news.map(newItem => {
                    return <a href={this.SiteUrl + newItem.FileRef} target="_self" data-interception="off"><div className="cardImagewithContent">
                      <img className="newsClass newsClassRes" src={newItem.BannerImageUrl.Url} alt="" />
                      <div className="cardContent">
                        <p>{newItem.Title}</p>
                      </div>
                    </div>
                    </a>
                  })
                  }
                </div>
              </div>
              <div className="RightContainerRight">
                <div className="RightContent">
                  <div className="NewsSeeAllClass">
                    <div>Company Updates</div>
                    {/* <span>See All</span> */}
                    <a href={this.state.Configuration.length > 0 ? this.state.Configuration.filter(configAll => configAll.Title == "See All" && configAll.Category == "Company Updates")[0].LinkRelatedToItem.Url : ""} target="_blank" data-interception="off" className="href companySeeAll"><span>See All</span></a>
                  </div>
                  <div className="CompanyUpdateClass">
                    {this.state.companyUpdates.map(CUItems => {
                      if (CUItems.Video)
                        return <a href={CUItems.LinkToNavigate.Url} target={CUItems.newTab ? "_blank" : "_self"} data-interception="off"><div className="PositionRelative">
                          <div className="cardImagewithContent">
                            <img className="newsClass" src={CUItems.ImageURL.Url} alt="" />
                            <div className="cardContent">
                              <p>{CUItems.Title}</p>
                            </div>
                          </div>
                          <img src={this.SiteUrl + "/SiteAssets/Images/play-icon.svg"} className="Image-Icon" />
                        </div>
                        </a>
                      else
                        return <a href={CUItems.LinkToNavigate.Url} target={CUItems.newTab ? "_blank" : "_self"} data-interception="off"><div className="cardImagewithContent">
                          <img className="newsClass" src={CUItems.ImageURL.Url} alt="" />
                          <div className="cardContent">
                            <p>{CUItems.Title}</p>
                          </div>
                        </div>
                        </a>
                    })}

                  </div>

                </div>
                <div className="RightContent">
                  <div className="NewsSeeAllClass">
                    <div>Resources</div>
                    <a href={this.state.Configuration.length > 0 ? this.state.Configuration.filter(configAll => configAll.Title == "See All" && configAll.Category == "Artifacts")[0].LinkRelatedToItem.Url : ""} target="_blank" data-interception="off" className="href companySeeAll"><span>See All</span></a>
                  </div>
                  <div className="ArtifactClass">
                    {this.state.artifacts.map(artifactsItem => {
                      return <a href={artifactsItem.LinkToNavigate.Url} target={artifactsItem.newTab ? "_blank" : "_self"} data-interception="off"><div className="cardImagewithContent">
                        <img className="newsClass" src={artifactsItem.ImageURL.Url} alt="" />
                        <div className="cardContent">
                          <p>{artifactsItem.Title}</p>
                        </div>
                      </div>
                      </a>
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}
