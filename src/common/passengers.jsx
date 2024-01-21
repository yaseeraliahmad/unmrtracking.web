import React,{useState} from 'react';
import { Navbar,Searchbar,Icon,NavRight, Page, BlockTitle,Link, List, ListItem, Toggle,f7, NavLeft } from 'framework7-react';
// import { toBeChecked, toHaveValue } from '@testing-library/jest-dom/matchers';
import {fetcher,baseurl, resetdata, refresh,role,text} from '../functions';


export default ({ f7route }) => {  
  const [passengers, setPassengers] = useState([]);
  const load= async()=>{
    try{
      fetcher(baseurl+"/api/trips/"+f7route.params.id+"/passengers").then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined&&res.value!==null){
          if(localStorage.getItem("status_index")!==null){
            JSON.parse(localStorage.getItem("status_index")).forEach((e) => localStorage.removeItem(e));
          }
          res.value.forEach((e) => localStorage.setItem(e._id+"",JSON.stringify(e)));
          localStorage.setItem("status_index",JSON.stringify(res.value.map((e)=>(e._id+""))));
          setPassengers(res.value);
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
    refresh();
    load();
    done();
  };
  return (
  <Page ptr onPageInit={onPageInit} ptrMousewheel={true} onPtrRefresh={reload}>
  
    <Navbar title="PASSENGERS" backLink="Back">
      <NavRight>
      <Link searchbarEnable=".searchbar-demo2" iconIos="f7:search" iconMd="material:search" />
      </NavRight>
      <Searchbar
        className="searchbar-demo2"
        expandable
        searchContainer=".search-list"
        searchIn=".item-title"
      />
    </Navbar>

    <List strongIos outlineIos dividersIos className="searchbar-not-found">
      <ListItem title="Nothing found" />
    </List>
    <List dividersIos mediaList outlineIos strongIos strong className="search-list searchbar-found">
    {(passengers!==null&&passengers!==undefined) && passengers.map((e,index) => {return (<ListItem link={"/"+(role.length>0?role[0]:"")+"/details/"+e._id} key={index} title={e.name+" - PNR: "+e.pnr} subtitle={e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+")"} text={(new Date(e.departure).toLocaleString())+" --> "+(new Date(e.arrival)).toLocaleString()}>
    </ListItem>
    )})}
    
    </List>
  </Page>
  );
}