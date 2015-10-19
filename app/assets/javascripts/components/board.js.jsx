var Board = React.createClass({

  getInitialState: function() {
    return {
      lists: this.props.lists,
      lastPriority: this.lastList()
    };
  },

  lastList: function() {
    if (this.state)
      last = this.state.lists[this.state.lists.length - 1]
    else
      last = this.props.lists[this.props.lists.length - 1]
    if (last)
      return last.priority;

  },

  getDefaultState: function() {
    return { lists: [] };
  },

  updateLists: function() {
    component = this
    $.ajax('/lists', {
      type: 'GET',
      success: function(data) {
        component.setState({ lists: data.lists });
        component.setState({lastPriority: component.lastList() });
        component.forceUpdate();
      }
    });
  },

  handleAdd: function() {
    component = this
    var name = this.refs.name.getDOMNode().value.trim();
    $.ajax('/add_list', {
      type: 'POST',
      data: { name: name },
      success: function(data) {
        component.refs.name.getDOMNode().value = '';
        component.updateLists();
      }
    });
  },

  showAddList: function() {
    if (this.state.lists.length < 5) {
      return <div className='row'>
               <form className='col s12'>
                 <div className='row'>
                   <div className='input-field col s3'>
                     <input type='text' ref='name' placehoder='name' />
                   </div>
                   <div className='input-field'>
                     <a onClick={this.handleAdd} className="waves-effect waves-light btn">Add</a>
                   </div>
                </div>
               </form>
             </div>;
    }
  },

  renderLists: function() {
    var listNodes = this.state.lists.map(function (list) {
      return <List key={list.id} priority={list.priority} last={this.state.lastPriority} listId={list.id} getLists={this.updateLists} name={list.name}/>;
    }, this);
    return listNodes;
  },

  render: function() {
    return <div>
             { this.showAddList() }
             <div className='row top-thirty'>
               { this.renderLists() }
             </div>
           </div>;
  }

})

