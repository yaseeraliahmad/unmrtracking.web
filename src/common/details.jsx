import React,{useState} from 'react';
import { Navbar,NavRight, Page, BlockTitle,Link, List, ListItem, Toggle,f7 } from 'framework7-react';
import { toBeChecked, toHaveValue } from '@testing-library/jest-dom/matchers';
import {fetcher,baseurl,refresh,role} from '../functions';

export default ({ f7route }) => {
  var [status, setStatus] = useState([]);
  var [details, setDetails] = useState([]);
  const [trips, setTrips] = useState([]);
  var timeInterval =null;
  const toggle= async(e)=>{
    if(role==null){return}
    if(["pilot","staff","flight_attendant"].indexOf((role.length>0?role[0]:""))==-1){return}
    var d={name:e.target.name,status:e.target.checked};
    if(d.status){return;}
    f7.dialog.prompt(d.name+" - Notes", (note) => {
      try{
        d["note"]=note.substr(0,250);

        fetcher(baseurl+"/api/"+{"pilot":"trips","staff":"passengers","flight_attendant":"passengers"}[f7route.params.role]+"/"+f7route.params.id+"/updatestatus",d).then(async(res1)=>{
          var res=await res1.json();
          if(res.value!==undefined){
            setStatus(status.map((e)=>(e.name==d.name)?res.value:e));
            if(res.value.completed){
              f7.views.main.router.back();
            }
          }
          if(res.msg!==undefined){
            f7.dialog.alert(res.msg);
          }
        }).catch((e)=>{
          f7.dialog.alert(e);
        });
      } catch (ex){
        f7.dialog.alert(ex)
      }
    });
  }
  const load= async()=>{
    try{
      if(role.length===0){return;}
      if(["admin","pilot","co-pilot"].indexOf(role[0])==-1){
        setDetails([JSON.parse(localStorage.getItem(f7route.params.id))]);
      } else {
        setTrips([JSON.parse(localStorage.getItem(f7route.params.id))]);
      }

      var action=(["pilot","staff","flight_attendant"].indexOf(role[0])==-1)?"status":"updatestatus";
      fetcher(baseurl+"/api/"+{"pilot":"trips","staff":"passengers","flight_attendant":"passengers","co-pilot":"trips","admin":"trips","flightdesk":"passengers","user":"passengers"}[f7route.params.role]+"/"+f7route.params.id+"/"+action).then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined&&res.value!==null){
          setStatus(res.value);
        }
        if(res.msg!==undefined){
          f7.dialog.alert(res.msg);
        }
      }).catch((e)=>{
        f7.dialog.alert(e);
      });
    } catch (e){
      f7.dialog.alert(e);
    }
  }

  const onPageBeforeRemove = () => {
    if(timeInterval!==null){clearInterval(timeInterval);}
  }
  const onPageInit = () => {
    try{
      if(role.length===0){return;}
      if(localStorage.getItem("token")===null){
        f7.views.main.router.navigate("/login/");
      } else {
        refresh();
        load();
        if(["pilot","staff","flight_attendant"].indexOf(role[0])==-1){
          timeInterval= setInterval(load, 1000*15);//15 sec -> 60 sec on Production
        }
      }  
    } catch(e){
      f7.dialog.alert(e);
    }
  }
  const reload = (done) => {
    load();
    refresh();
    done();
  };
  return (
  <Page ptr onPageInit={onPageInit} ptrMousewheel={true} onPtrRefresh={reload} onPageBeforeRemove={onPageBeforeRemove}>

    <Navbar title="Details" backLink="Back">
      <NavRight>
      </NavRight>
    </Navbar>
      {/* details */}
      <List strongIos outlineIos dividersIos className="searchbar-not-found">
      <ListItem title="Nothing found" />
      </List>
      <List dividersIos mediaList outlineIos strongIos strong>
      {(role!==null&&trips!==null&&trips!==undefined) && trips.map((e,index) => {return (<ListItem key={index} title={e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+") "+e.flight.number+"("+e.flight.type+")"} subtitle={e.from.airport+" ("+e.from.terminal+")"+" --> "+e.to.airport+" ("+e.to.terminal+")"} text={(new Date(e.departure).toLocaleString())+" --> "+(new Date(e.arrival)).toLocaleString()}></ListItem>)})}
      {(role!==null&&details!==null&&details!==undefined) && details.map((e,index) => {return (<ListItem key={index} title={e.name+" - PNR: "+e.pnr} subtitle={e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+")"} text={(new Date(e.departure).toLocaleString())+" --> "+(new Date(e.arrival)).toLocaleString()}></ListItem>)})}
      </List>
      {role!=null && 
      <>
        {(["pilot","staff","flight_attendant"].indexOf((role.length>0?role[0]:""))!==-1)?(
          <>
          <List dividersIos mediaList outlineIos strongIos strong>
          {status.map((e,index) => {return (<ListItem key={index} title={e.name} {...(e.status && {subtitle:(new Date(e.create_time)).toLocaleString()})} {...(e.note!=="" && {text:e.note})} after={<Toggle checked={e.status} name={e.name} onChange={(e)=>toggle(e)} />}>
          </ListItem>
          )})}
          </List>
          </>
        ) : (
          <>
          <List dividersIos mediaList outlineIos strongIos strong>
          {status.map((e,index) => {return (<ListItem key={index} title={e.name} {...(e.status && {subtitle:(new Date(e.create_time)).toLocaleString()})} {...(e.note!=="" && {text:e.note})} after={<Toggle checked={e.status} name={e.name} disabled />}>
          </ListItem>
          )})}
          </List>
          </>
        )}
      </>}
  </Page>
  );
}