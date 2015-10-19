var Card = React.createClass({
  getInitialState: function() {
    return {
      title: this.props.title,
      body: this.props.body,
      id: this.props.cardId,
      reloader: this.props.reload
    };
  },

  removeCard: function() {
    component = this;
    $.ajax('/delete_card', {
      type: 'DELETE',
      data: { id: component.props.cardId },
      success: function() {
        component.props.reloader();
      }
    });
  },

  render: function() {
    return <div className='row'>
             <div className='col s12'>
               <div className='card blue-grey darken-1'>
                 <span className='card-title center-align'>{this.state.title}</span>
                 <p>{this.state.body}</p>
                 <div className='row'>
                   <a onClick={this.removeCard} className='btn col s10 offset-s1 blue-grey darken-4'>Delete</a>
                  </div>
               </div>
             </div>
           </div>;
  }
})

