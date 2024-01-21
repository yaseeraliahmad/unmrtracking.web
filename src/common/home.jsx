import React,{useState} from 'react';
import { Navbar,Searchbar,Icon,NavRight, Page, BlockTitle,Link, List, ListItem, Toggle,f7, NavLeft } from 'framework7-react';
// import { toBeChecked, toHaveValue } from '@testing-library/jest-dom/matchers';
import {fetcher,baseurl, resetdata, refresh,role,text} from '../functions';


export default ({ f7route }) => {  
  const [passengers, setPassengers] = useState([]);
  const [trips, setTrips] = useState([]);
  const newtask= async()=>{
    f7.dialog.prompt("PNR", (pnr) => {
      try{
        if(pnr.length!==6){f7.dialog.alert("Invalid PNR");return;}
        fetcher(baseurl+"/api/pnr/"+pnr).then(async(res1)=>{
          var res=await res1.json();
          if(res.value!==undefined){
            localStorage.setItem(res.value._id+"",JSON.stringify(res.value));
            var ids=[res.value._id+""];
            if(localStorage.getItem("status_index")!==null){
              var id1=JSON.parse(localStorage.getItem("status_index"));
              id1.push(res.value._id+"");
            }
            localStorage.setItem("status_index",JSON.stringify(ids));
            setPassengers([...[res.value],...passengers]);
            f7.views.main.router.navigate("/"+(role.length>0?(role.length>0?role[0]:""):"")+"/details/"+res.value._id);
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
    });
  }
  const load= async()=>{
    try{
      if(role.length===0){return;}
      if(role.indexOf("staff")!==-1){
        if(localStorage.getItem("status_index")!==null){
          var passengers1=[];
          JSON.parse(localStorage.getItem("status_index")).forEach((e)=>{
            passengers1.push(JSON.parse(localStorage.getItem(e)))
          })
          setPassengers(passengers1);
        }
        return;
      }
      fetcher(baseurl+"/api/"+({user:"passengers",flightdesk:"passengers",staff:"passengers","flight_attendant":"trips",admin:"trips",pilot:"trips","co-pilot":"trips"}[(role.length>0?role[0]:"")])).then(async(res1)=>{
        //if(res1.status)
        var res=await res1.json();
        if(res.value!==undefined&&res.value!==null){
          if(["pilot","co-pilot","admin","user","flightdesk"].indexOf(role[0])!==-1){
            if(localStorage.getItem("status_index")!==null){
              JSON.parse(localStorage.getItem("status_index")).forEach((e) => localStorage.removeItem(e));
            }
            res.value.forEach((e) => localStorage.setItem(e._id+"",JSON.stringify(e)));
            localStorage.setItem("status_index",JSON.stringify(res.value.map((e)=>(e._id+""))));
          }

          if(["user","flightdesk","staff"].indexOf((role.length>0?role[0]:""))!==-1){
            setPassengers(res.value);
          } else if(["admin","pilot","co-pilot","flight_attendant"].indexOf((role.length>0?role[0]:""))!==-1) {
            setTrips(res.value);
          }
        }
        if(res.msg!==undefined){
          f7.dialog.alert(res.msg);
        }
      }).catch((e)=>{
        f7.dialog.alert(e);
      });
    } catch (e){
      f7.dialog.alert(e)
    }
  }
  const logout = async () => {
    try{
      fetcher(baseurl+"/api/logout").then(async(res1)=>{
      }).catch((e)=>{
      })
      resetdata();
    } catch (e){
      f7.dialog.alert(e);
    }
  };
  const onPageInit = () => {
    try{
      if(localStorage.getItem("token")===null){
        f7.views.main.router.navigate("/login/");
      } else {
        refresh();
        load();
      }  
    } catch(e){
      f7.dialog.alert(e);
    }
  }
  const reload = (done) => {
    if(localStorage.getItem("status_index")!==null){
      JSON.parse(localStorage.getItem("status_index")).forEach((e) => localStorage.removeItem(e));
      localStorage.removeItem("status_index");
    }
    setPassengers([]);
    setTrips([]);
    refresh();
    load();
    done();
  };
  return (
  <Page ptr onPageInit={onPageInit} ptrMousewheel={true} onPtrRefresh={reload} onPageReinit={load}>
  
    <Navbar title={(role.length>0?(role.length>0?role[0]:"").toUpperCase().replace(/\_/g," ")+" ":"")+"DASHBOARD"} >
      {/* <NavLeft href="/login/" title="Login" iconIos="f7:menu"  iconMd="material:menu" ></NavLeft> */}
      <NavRight>
      <Link searchbarEnable=".searchbar-demo" iconIos="f7:search" iconMd="material:search" />
      {role.length>0 &&
        <>
        {["user","flightdesk","admin"].indexOf((role.length>0?role[0]:""))!==-1 &&
        <Link href={["user","flightdesk"].indexOf((role.length>0?role[0]:""))===-1?((role.length>0?role[0]:"")!=="admin"?"#":"/admin/create_trip/"):("/"+(role.length>0?role[0]:"")+"/booking/")} iconIos="f7:plus" iconMd="material:add" />}
        
        {(["staff"].indexOf((role.length>0?role[0]:""))!==-1) &&
        <Link href="#" onClick={(e)=>newtask()} iconIos="f7:plus" iconMd="material:add" />
        }
        </>
      }
      <Link title="Logout" icon="icon-logout" onClick={logout} iconIos="f7:more_vert" iconMd="material:more_vert" />
      </NavRight>
      <Searchbar
        className="searchbar-demo"
        expandable
        searchContainer=".search-list"
        searchIn=".item-title"
      />
    </Navbar>

    <List strongIos outlineIos dividersIos className="searchbar-not-found">
      <ListItem title="Nothing found" />
    </List>
    <List dividersIos mediaList outlineIos strongIos strong className="search-list searchbar-found">
    {(role!==null&&trips!==null&&trips!==undefined) && trips.map((e,index) => {return (<ListItem link={((role.length>0?role[0]:"")==="flight_attendant")?"/"+(role.length>0?role[0]:"")+"/trips/"+e._id+"/passengers/":("/"+(role.length>0?role[0]:"")+"/"+(((role.length>0?role[0]:"")==="pilot")?"details":"details")+"/"+e._id)} key={index} title={e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+") "+e.flight.number+"("+e.flight.type+")"} subtitle={e.from.airport+" ("+e.from.terminal+")"+" --> "+e.to.airport+" ("+e.to.terminal+")"} text={(new Date(e.departure).toLocaleString())+" --> "+(new Date(e.arrival)).toLocaleString()}>
    </ListItem>
    )})}
    {(role!==null&&passengers!==null&&passengers!==undefined) && passengers.map((e,index) => {return (<ListItem link={"/"+(role.length>0?role[0]:"")+"/"+(["staff"].indexOf((role.length>0?role[0]:""))!==-1?"details":"details")+"/"+e._id} key={index} title={e.name+" - PNR: "+e.pnr} subtitle={e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+")"} text={(new Date(e.departure).toLocaleString())+" --> "+(new Date(e.arrival)).toLocaleString()}>
    </ListItem>
    )})}
    
    </List>
  </Page>
  );
}