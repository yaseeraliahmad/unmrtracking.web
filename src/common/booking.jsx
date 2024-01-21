import React, { useState } from 'react';
import {Page,LoginScreenTitle,List,ListItem,ListInput,Link,Button,Navbar,ListGroup,NavRight,f7,Icon,Toggle} from 'framework7-react';
import {fetcher,baseurl,formvalidate} from '../functions';

export default ({ f7route }) => {
  var [trips, setTrips] = useState([]);
  var [terminals, setTerminals] = useState([]);
  var [flight, setFlight] = useState("");
  var [specialfare, setSpecialfare] = useState("Unaccompanied Minor");
  const getdata = (part,output=null) => {
    //console.log(f7.form.convertToData("#dataform"));
    // f7.form.fillFromData('#unmr_register', {unmr_name:"Yaseer"});
    //f7.formStoreData("unmr_register", formJSON)
    try{
      var d=null;
      if(part==="searchflights"){
        d=f7.form.convertToData("#searchflights");
        if(!formvalidate(d, "#searchflights")){return;};
        if(d.from===d.to){
          f7.dialog.alert("From and To could Not be Same.");
          return;
        }
      }

      fetcher(baseurl+"/api/"+part,d).then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined){
          if(part=="searchflights"){
            if(res.value.length===0){f7.dialog.alert("No Record Found.");}
            setTrips(res.value);
          } else if(part=="terminals"){
            setTerminals(res.value);
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
  const setdsata = () => {
    //console.log(f7.form.convertToData("#dataform"));
    // f7.form.fillFromData('#unmr_register', {unmr_name:"Yaseer"});
    //f7.formStoreData("unmr_register", formJSON)
    try{
      var d=f7.form.convertToData("#dataform");
      if(!formvalidate(d, "#dataform")){return;};
      fetcher(baseurl+"/api/passengers",d).then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined){
          // console.log(res.value);
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
  const onPageInit = () => {
    getdata("terminals");
  }
  return (
    <Page loginScreen onPageInit={onPageInit}>
      <Navbar title="Flight Booking" backLink="Back">
        <NavRight>
        </NavRight>
      </Navbar>
      <LoginScreenTitle>Flight Booking</LoginScreenTitle>
      <List form id="dataform">
        <ListGroup id="searchflights">
          <ListItem title="Flight Search" groupTitle/>
          <ListInput
            label="Trip"
            type="select"
            placeholder="Please choose..."
            name="trip_type"
            required validate outline clear>
            <Icon icon="demo-list-icon" slot="media" />
            <option>One Way</option>
            {/* ... */}
          </ListInput>
          <ListInput
            label="Date of Departure"
            type="date"
            placeholder="Date of Departure"
            name="departure"
            defaultValue={new Date().toISOString().substring(0,10)}
            min={new Date().toISOString().substring(0,10)}
            required validate floatingLabel clearButton outline
          >
          <Icon icon="demo-list-icon" slot="media" />
          </ListInput>
          <ListInput
            label="From"
            type="select"
            placeholder="From"
            name="from"
            required validate floatingLabel outline>
            <Icon icon="demo-list-icon" slot="media" />
            <option value="" key="" ></option>
            {terminals.map((e,index) => {return (<option value={e.iata} key={e.iata}>{e.city +" ("+e.iata+") - "+e.airport}</option>)})}
          </ListInput>
          <ListInput
            label="To"
            type="select"
            placeholder="To"
            name="to"
            required validate floatingLabel outline >
            <Icon icon="demo-list-icon" slot="media" />
            <option value="" key="" ></option>
            {terminals.map((e,index) => {return (<option value={e.iata} key={e.iata} >{e.city +" ("+e.iata+") - "+e.airport}</option>)})}
          </ListInput>
          <ListInput
            label="Special Fare"
            type="select"
            placeholder="Special Fare"
            name="specialfare"
            defaultValue={specialfare}
            required validate outline clear onChange={(e) => setSpecialfare(e.target.value)}>
            <Icon icon="demo-list-icon" slot="media"/>
            <option>Regular</option>
            {/* ... */}
            <option>Unaccompanied Minor</option>
          </ListInput>
          <Button onClick={(e) => {getdata("searchflights")}} fill round>Find</Button>
        </ListGroup>
        {trips.length>0&&
        <>
        <ListGroup>
          <ListItem title="Flights" groupTitle />
          {/* {(trips!=null&&trips!=undefined) && trips.map((e,index) => {return (<ListItem key={index} title={e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+")"} subtitle={e.from.airport+" ("+e.from.terminal+")"+" --> "+e.to.airport+" ("+e.to.terminal+")"} text={(new Date(e.departure).toLocaleString())+" --> "+(new Date(e.arrival)).toLocaleString()}>
          </ListItem>
          )})} */}
          <ListInput
            label="Flight"
            type="select"
            placeholder="Flight"
            name="trip"
            defaultValue={flight}
            required validate clear outline onChange={(e) => setFlight(e.target.value)}>
            <Icon icon="demo-list-icon" slot="media" />
            <option value="" key="" ></option>
            {trips.map((e,index) => {return (<option value={e._id} key={e._id}>{e.from.city+" ("+e.from.iata+")-->"+e.to.city+" ("+e.to.iata+") "+e.flight.number+"("+e.flight.type+")"}</option>)})}
          </ListInput>
        </ListGroup>
        {flight!==""&&
        <>
        <ListGroup name="passenger_details">
          <ListItem title="Passenger Details" groupTitle />
          <ListInput
            label="Title"
            type="select"
            placeholder="Please choose..."
            name="name_prefix"
            required validate outline>
            <Icon icon="demo-list-icon" slot="media" />
            <option>Mr.</option>
            <option>Ms.</option>
            {specialfare!="Unaccompanied Minor"&&<option>Mrs.</option>}
          </ListInput>
          <ListInput
          label="Name"
          type="text"
          placeholder="Name"
          name="name"
          required validate floatingLabel clearButton outline maxlength={30} pattern="^[\w\s\d\-_.+#]{1,30}$"
          >
          <Icon icon="demo-list-icon" slot="media" />
          </ListInput>
          <ListInput
          label="Date of Birth"
          type="date"
          placeholder="Date of Birth"
          name="date_of_birth"
          required validate floatingLabel clearButton outline
          >
          <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListItem>
        <Icon icon="demo-list-icon" slot="media" />
          <span>Wheelchair</span>
          <Toggle name="wheelchair"/>
        </ListItem>
        {specialfare=="Unaccompanied Minor"&&
        <>
        <ListItem><LoginScreenTitle>Fly Solo Form</LoginScreenTitle></ListItem>
        <ListItem title="Parent/ Guardian Details (Departure City)" groupTitle />
        <ListInput
          label="Title"
          type="select"
          placeholder="Please choose..."
          name="sender_guardian_name_prefix"
          required validate outline>
          <Icon icon="demo-list-icon" slot="media" />
          <option>Mr.</option>
          <option>Ms.</option>
          <option>Mrs.</option>
        </ListInput>
        <ListInput
          label="Name"
          type="text"
          placeholder="Name"
          name="sender_guardian_name"
          required validate floatingLabel clearButton outline maxlength={30} pattern="^[\w\s\d\-_.+#]{1,30}$"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="Email"
          type="email"
          placeholder="Email"
          name="sender_guardian_email"
          required validate floatingLabel clearButton outline maxlength={50}
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="Telephone number"
          type="text"
          placeholder="Telephone number"
          name="sender_guardian_telephone_number"
          required validate floatingLabel clearButton outline maxlength={15} pattern="^([+]*[\d]){10,15}$"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput 
          label="Address"
          type="textarea"
          placeholder="Address"
          name="sender_guardian_address"
          required validate floatingLabel clearButton outline resizable maxlength={250} pattern="^[\w\s\d\-_.+#]{1,250}$"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListItem title="Parent / Guardian Details (Arrival City)" groupTitle />
        <ListInput
          label="Title"
          type="select"
          placeholder="Please choose..."
          name="receiver_guardian_name_prefix"
          required validate outline>
          <Icon icon="demo-list-icon" slot="media" />
          <option>Mr.</option>
          <option>Ms.</option>
          <option>Mrs.</option>
        </ListInput>
        <ListInput
          label="Name"
          type="text"
          placeholder="Name"
          name="receiver_guardian_name"
          required validate floatingLabel clearButton outline maxlength={30} pattern="^[\w\s\d\-_.+#]{1,30}$"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="Email"
          type="email"
          placeholder="Email"
          name="receiver_guardian_email"
          required validate floatingLabel clearButton outline
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="Telephone number"
          type="text"
          placeholder="Telephone number"
          name="receiver_guardian_telephone_number"
          required validate floatingLabel clearButton outline maxlength={15} pattern="^([+]*[\d]){10,15}$"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput 
          label="Address"
          type="textarea"
          placeholder="Address"
          name="receiver_guardian_address"
          required validate floatingLabel clearButton outline maxlength={250} resizable pattern="^[\w\s\d\-_.+#]{1,250}$"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        <ListInput
          label="Note"
          type="textarea"
          placeholder="Note"
          name="note"
          validate floatingLabel clearButton outline resizable maxlength={250} pattern="(.){0,250}"
        >
        <Icon icon="demo-list-icon" slot="media" />
        </ListInput>
        </>
        }
        </ListGroup>
        <ListItem>
        <Icon icon="demo-list-icon" slot="media" />
          <span>I Agree on <Link href="">Terms and Conditions</Link></span>
          <Toggle defaultChecked required name="agree"/>
        </ListItem>
        <Button onClick={setdsata} fill round>Book</Button>
        </>
        }
        </>
        }
        
      </List>
    </Page>
  );
};