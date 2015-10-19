var List = React.createClass({
  getInitialState: function() {
    return {
      name: this.props.name,
      priority: this.props.priority,
      getLists: this.props.getLists,
      last: this.props.last,
      edit: false,
      cards: []
    };
  },

  componentDidMount: function() {
    var component = this;
    $.ajax('/list', {
      type: 'GET',
      data: { id: component.props.listId },
      success: function(data) {
        var cardNodes = data.cards.map(function (card) {
          return <Card key={card.id} cardId={card.id} title={card.title} reloader={component.reload} body={card.body} />
        }, component);
        component.setState({ cards: cardNodes })
      }
    });
  },

  reload: function() {
    component = this
    $.ajax('/list', {
      type: 'GET',
      data: { id: component.props.listId },
      success: function(data) {
        var cardNodes = data.cards.map(function (card) {
          return <Card key={card.id} cardId={card.id} title={card.title} reloader={component.reload} body={card.body} />
        }, component);
        component.setState({ cards: cardNodes })
      }
    });
  },

  handleDelete: function() {
    component = this
    $.ajax('/remove_list', {
      type: 'DELETE',
      data: { id: component.props.listId },
      success: function() {
        component.props.getLists();
      }
    });
  },

  handleEdit: function() {
    this.setState({ edit: !this.state.edit});
  },

  updateList: function() {
    var name = this.refs.editName.getDOMNode().value.trim();
    var component = this;
    $.ajax('/edit_list', {
      type: 'PUT',
      data: { id: component.props.listId, name: name },
      success: function() {
        component.props.getLists();
      }
    });
  },

  renderCards: function() {
    return this.state.cards;
  },

  renderMoveLeft: function() {
    if (this.state.priority != 1)
      return <span className='pointer' onClick={this.moveLeft}>&lt;</span>;
  },

  renderMoveRight: function() {
    if (this.state.priority < this.props.last)
      return <span className='pointer' onClick={this.moveRight}>&gt;</span>;
  },

  moveLeft: function() {
    var component = this;
    $.ajax('/move_left', {
      type: 'PUT',
      data: { id: component.props.listId },
      success: function() {
        component.props.getLists();
      }
    });
  },

  moveRight: function() {
    var component = this;
    $.ajax('/move_right', {
      type: 'PUT',
      data: { id: component.props.listId },
      success: function() {
        component.props.getLists();
      }
    });
  },

  addCard: function() {
    return <a onClick={this.showAddCard} className="col s10 offset-s1 waves-effect waves-light btn">Add Card</a>;
  },

  showAddCard: function() {
    this.setState({ showAddForm: !this.state.showAddForm });
  },

  addForm: function() {
    if (this.state.showAddForm) {
      return <div className='top-thirty'>
               <input type='text' className='white' placeholder='title' ref='cardTitle' />
               <textarea className='materialize-textarea white' ref='cardBody' />
               <button className='btn' onClick={this.addNewCard} type='button'>Submit</button>
            </div>
    }
  },

  addNewCard: function() {
    component = this;
    $.ajax('/add_card', {
      type: 'POST',
      data: {
        id: component.props.listId,
        title: component.refs.cardTitle.getDOMNode().value.trim(),
        body: component.refs.cardBody.getDOMNode().value.trim()
      },
      success: function(data) {
        component.refs.cardTitle.getDOMNode().value = '';
        component.refs.cardBody.getDOMNode().value = '';
        component.setState({ showAddForm: false });
        var cardNodes = data.cards.map(function (card) {
          return <Card key={card.id} cardId={card.id} reloader={component.reload} title={card.title} body={card.body} />
        }, component);
        component.setState({ cards: cardNodes })
      }
    });
  },

  showList: function() {
    return <div className='col s2'>
             <div className='list-header col s12'>
               <div className='col s1'>
                 <span className='pointer' onClick={this.handleDelete}>X</span>
               </div>
               <div className='col s7'>
                 <h5 className='center-align list' onClick={this.handleEdit}>{ this.state.name }</h5>
               </div>
               <div className='col s1'>
                 { this.renderMoveLeft() }
               </div>
               <div className='col s1'>
                 { this.renderMoveRight() }
               </div>
             </div>
             <div className='list-body col s12'>
               <div className='col s12'>
                 <div className='top-5 bottom-5 row'>
                   { this.addCard() }
                 </div>
                 { this.addForm() }
                 { this.renderCards() }
               </div>
             </div>
           </div>;
  },

  editList: function() {
    return <div className='col s2'>
             <div className='col s1'>
               <span className='pointer' onClick={this.handleEdit}>X</span>
             </div>
             <form onSubmit={this.updateList} className='col s10'>
               <input type='text' autoFocus ref='editName' defaultValue={ this.state.name } />
             </form>
             <div className='list-body col s12'>
               <div classname='col s12'>
                 <div className='top-5 bottom-5 row'>
                   { this.addForm() }
                 </div>
                 { this.addCard() }
                 { this.renderCards() }
               </div>
            </div>
           </div>;
  },

  render: function() {
    if (this.state.edit)
      return this.editList();
    else
      return this.showList();
  }
})

