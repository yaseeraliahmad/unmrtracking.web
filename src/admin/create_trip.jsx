import React, { useState } from 'react';
import {Page,LoginScreenTitle,List,ListItem,ListInput,Button,Navbar,NavRight,f7,Icon} from 'framework7-react';
import {fetcher,baseurl,formvalidate} from '../functions';

export default ({ f7route }) => {
  var [flights, setFlights] = useState([]);
  var [terminals, setTerminals] = useState([]);
  var [pilots, setPilots] = useState([]);
  var [copilots, setCopilots] = useState([]);
  var [flightattendants, setFlightattendants] = useState([]);
  var [crews, setCrews] = useState([]);
  const getdata = (part="",output=null) => {
    try{
      // var d=f7.form.convertToData("#dataform");
      fetcher(baseurl+"/api/"+part).then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined){
          if(part=="all"){
            await setFlights(res.value["flights"]);
            await setTerminals(res.value["terminals"]);
            await setPilots(res.value["pilots"]);
            await setCopilots(res.value["co-pilots"]);
            await setFlightattendants(res.value["flight_attendants"]);
          }
        } 
        if(res.msg!==undefined){
          f7.dialog.alert(res.msg);
        }
      }).catch((e)=>{
        f7.dialog.alert(e);
      });
    } catch (ex){
      console.log(ex)
      f7.dialog.alert(ex)
    }
  };
  const setdata = () => {
    try{
      var d=f7.form.convertToData("#dataform");
      // console.log(d);
      // return;
      if(!formvalidate(d, "#dataform")){return;};
      if(d.from===d.to){
        f7.dialog.alert("From and To could Not be Same.");
        return;
      }
      fetcher(baseurl+"/api/trips",d).then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined){
          //TO DO
        } 
        if(res.msg!==undefined){
          f7.dialog.alert(res.msg);
        }
      }).catch((e)=>{
        f7.dialog.alert(e);
      });
    } catch (ex){
      console.log(ex)
      f7.dialog.alert(ex)
    }
  };
  
  const _onchange = (input,output=null) => {
    if(input=="crews"){
      // console.log();
    }
  }

  const onPageInit = () => {
    getdata("all");
  }
  return (
    <Page loginScreen onPageInit={onPageInit}>
      <Navbar title="Create Trip" backLink="Back">
        <NavRight>
        </NavRight>
      </Navbar>
      <LoginScreenTitle>Create Trip</LoginScreenTitle>
      <List form id="dataform">
      {/* defaultValue="Male" */}
        <ListInput
          label="Flight (Name & Type)"
          type="select"
          placeholder="Flight (Name & Type)"
          name="flight"
          required floatingLabel validate outline onChange={() => _onchange("flights","flight")}>
          <Icon icon="demo-list-icon" slot="media" />
          <option value="" key="" ></option>
          {flights.map((e,index) => {return (<option value={e._id} key={e._id} >{e.number+" - "+e.type}</option>)})}
        </ListInput>
        <ListItem
          title="Crew Members"
          type="select"
          floatingLabel outline smartSelect
          smartSelectParams={{ openIn: 'popup', searchbar: true, searchbarPlaceholder: "Crew Members" }}
          >
          <Icon icon="demo-list-icon" slot="media" />
          <select name="crew" max="10" multiple required onChange={() => _onchange("crews")}>
          <optgroup label="Pilot">
          {pilots.map((e,index) => {return (<option value={e._id} key={e._id}>{e.name+"-"+e.gender}</option>)})}
          </optgroup>
          <optgroup label="Co-Pilot">
          {copilots.map((e,index) => {return (<option value={e._id} key={e._id}>{e.name+"-"+e.gender}</option>)})}
          </optgroup>
          <optgroup label="Flight Attendant">
          {flightattendants.map((e,index) => {return (<option value={e._id} key={e._id}>{e.name+"-"+e.gender}</option>)})}
          </optgroup>
          </select>
        </ListItem>
        <ListInput
          label="From (Airport Terminal)"
          type="select"
          placeholder="From (Airport Terminal)"
          name="from"
          required floatingLabel validate outline onChange={() => _onchange("terminals","terminal")}>
          <Icon icon="demo-list-icon" slot="media" />
          <option value="" key="" ></option>
          {terminals.map((e,index) => {return (<option value={e._id} key={e._id}>{e.airport+" - "+e.terminal+"-"+e.city}</option>)})}
        </ListInput>
        <ListInput
          label="Departure"
          type="datetime-local"
          placeholder="Departure"
          name="departure"
          required validate floatingLabel clearButton outline
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="To (Airport Terminal)"
          type="select"
          placeholder="To (Airport Terminal)"
          name="to"
          required floatingLabel validate outline onChange={() => _onchange("terminals","terminal")}>
          <Icon icon="demo-list-icon" slot="media" />
          <option value="" key="" ></option>
          {terminals.map((e,index) => {return (<option value={e._id} key={e._id}>{e.airport+" ("+e.terminal+") "+e.city}</option>)})}
        </ListInput>
        <ListInput
          label="Arrival"
          type="datetime-local"
          placeholder="Arrival"
          name="arrival"
          required validate floatingLabel clearButton outline
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="Note"
          type="textarea"
          placeholder="Note"
          name="note"
          validate floatingLabel clearButton outline resizable maxlength={250}
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
      </List>
      <List>
        <Button onClick={setdata} fill round>Save</Button>
      </List>
    </Page>
  );
};