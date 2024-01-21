import React, { useState } from 'react';
import {fetcher,baseurl,refresh,role,setRole,formvalidate} from '../functions';
import {Page,LoginScreenTitle,List,ListInput,Button,f7,Icon} from 'framework7-react';

export default ({ f7route }) => {
  const onPageInit = () => {
  }
  const login = async () => {
    try{
      var d=f7.form.convertToData("#dataform");
      if(!formvalidate(d, "#dataform")){return;};
      fetcher(baseurl+"/api/login",d).then(async(res1)=>{
        var res=await res1.json();
        if(res.value!==undefined){
          setRole(res.value.role);
          localStorage.setItem("role",JSON.stringify(role));
          localStorage.setItem("token",res.token);
          localStorage.setItem("value",JSON.stringify(res.value));
          // f7.views.main.router.navigate("/");
          window.location.href="/";
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
  return (
    <Page noToolbar noNavbar noSwipeback loginScreen ptrMousewheel={true} onPageInit={onPageInit}>
      
      <LoginScreenTitle><img src="/img/logo.png" style={{width: "200px",borderRadius: 20}}/><br/>Login</LoginScreenTitle>
      <List form strongIos dividersIos insetIos id="dataform">
        <ListInput label="Email" type="email" placeholder="Email" name="userid" required validate floatingLabel clearButton outline>
        <Icon material="person" slot="media" />
        </ListInput>
        <ListInput label="Password" type="password" placeholder="Password" name="password" required validate floatingLabel clearButton outline pattern="^[\w\d\-_.+$@!%&^*#]{8,30}$">
        <Icon material="lock" slot="media" />
        </ListInput>
      </List>
      <List inset>
        <Button onClick={login} fill round>Login</Button>
      </List>
    </Page>
  );
};
