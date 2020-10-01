import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    }
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }
  
  renderSwimlane(name, clients, ref) {
    return (
      <Swimlane name={name} clients={clients} dragulaRef={ref}/>
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, this.swimlanes.backlog)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, this.swimlanes.inProgress)}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, this.swimlanes.complete)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  getCardClass(column){
    switch(column){
      case this.swimlanes.backlog.current:
        return "Card-grey";
      case this.swimlanes.inProgress.current:
        return "Card-blue";
      case this.swimlanes.complete.current:
        return "Card-green";
      default:
        return "";
    }
  }

  componentDidMount() {
    this.drake = Dragula([
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current, 
      this.swimlanes.complete.current]
    );
    
    //set onclick so color changes when card changes swimlane
    this.drake.on("drop", (e1, target,source,sibling) => this.updateLogs(e1, target, source,sibling));
  }

  componentWillUnmount(){
    this.drake.remove();
  }

  updateLogs(e1, target, source, sibling){
    // Reverting DOM changes from Dragula
    this.drake.cancel(true);

    //find the index of src and destination columns
    let src = this.getCardClass(source);
    let des = this.getCardClass(target);

    let targetlane = "backlog";
    if(des === "Card-blue"){
      targetlane = "in-progress";
    }else if(des === "Card-green"){
      targetlane = "complete";
    }

    if(src !== "" && des !== ""){
      //update classList appropriately
      e1.classList.remove(src);
      e1.classList.add(des);

      //update clients appropriately

      //make copy of current client state
      const clientList = [
        ...this.state.clients.backlog,
        ...this.state.clients.inProgress,
        ...this.state.clients.complete
      ]

      //make a copy of dragged client
      const client = clientList.find(client => client.id === e1.dataset.id);
      const clientclone = {
        ...client,
        status: targetlane
      }

      //remove old client info from clients list
      const updatedClients = clientList.filter(client => client.id !== clientclone.id)

      //add client to client list
      const index = updatedClients.findIndex( client => sibling && client.id === sibling.dataset.id )
      updatedClients.splice(index === -1? updatedClients.length: index, 0, clientclone);

      //update react state
      this.setState({
        clients: {
          backlog: updatedClients.filter(client => !client.status || client.status === 'backlog'),
          inProgress: updatedClients.filter(client => client.status && client.status === 'in-progress'),
          complete: updatedClients.filter(client => client.status && client.status === 'complete'),
        }
      });
      
    } 
  }
}
