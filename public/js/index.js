var socket = io();

var user = (function () {
    var socket = io();
    return {
        getMessage: function (callback) {
            socket.on('new message', callback);
        },
        talk: function (content) {
            socket.emit('new message', content);
        }
    };

}());

var Message = React.createClass({
    render: function () {
        return (
            <div className="comment">
                <a className="avatar">
                    <img src="/img/user.jpg" />
                </a>
                <div className="content">
                    <a className="author">{this.props.author}</a>

                    <div className="metadata">
                        <span className="date">Today at 5:42PM</span>
                    </div>
                    <div className="text">
                        {this.props.content}
                    </div>
                </div>
            </div>
        );
    }
});

var Messages = React.createClass({
    render: function () {
        var messageRows = [];
        for (var i = 0; i < this.props.messages.length; i++) {
            var message = this.props.messages[i];
            messageRows.push(<Message key={i} author={message.author} content={message.content}/>);
        }
        return (
            <div className="ui comments">
                {messageRows}
            </div>
        );
    }
});

var Talk = React.createClass({
    handleTalk: function (event) {
        var content = React.findDOMNode(this.refs.content).value.trim();
        this.props.handleTalk(content);
        React.findDOMNode(this.refs.content).value = '';
    },
    render: function () {
        return (
            <div className="ui action fluid input">
                <input type="text" placeholder="Say something..." ref="content"/>
                <button className="ui icon blue button"
                        onClick={this.handleTalk}>
                    <i className="send icon"></i>
                </button>
            </div>
        );
    }
});

var Page = React.createClass({
    getInitialState: function () {
        var messages = [];
        user.getMessage(function (data) {
            messages.push({
                author: data.username,
                content: data.content
            });
            this.setState({messages: messages});
        }.bind(this));
        return {messages: messages};
    },
    handleTalk: function (content) {
        user.talk(content);
    },
    render: function () {
        return (
            <div className="ui main container grid">
                <div className="eleven wide column">
                    <div className="ui segment">
                        <Messages messages={this.state.messages}/>
                    </div>
                </div>
                <div className="five wide column">
                    <div>
                        <Talk handleTalk={this.handleTalk}/>
                    </div>
                    <div className="ui segment">
                    </div>
                </div>
            </div>
        );
    }
});


React.render(
    <Page />,
    document.getElementById('main')
);
