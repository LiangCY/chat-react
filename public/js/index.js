var socket = io();

var room = (function () {
    var socket = io();
    return {
        getMessage: function (callback) {
            socket.on('new message', callback);
        },
        sendMessage: function (content) {
            socket.emit('new message', content);
        },
        userOnline: function (callback) {
            socket.on('user online', callback);
        },
        userLeave: function (callback) {
            socket.on('user leave', callback);
        }
    };

}());

var Message = React.createClass({
    render: function () {
        return (
            <div className="comment">
                <a className="avatar">
                    <img src={"http://q1.qlogo.cn/headimg_dl?bs=qq&spec=100&dst_uin=" + this.props.author.qq}/>
                </a>

                <div className="content">
                    <a className="author">{this.props.author.name}</a>

                    <div className="metadata">
                        <span className="date">{moment(this.props.date).format('M-D H:mm')}</span>
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
            messageRows.push(<Message key={i} author={message.author} content={message.content} date={message.date}/>);
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

var User = React.createClass({
    render: function () {
        return (
            <div className="item">
                <img className="ui avatar image"
                     src={"http://q1.qlogo.cn/headimg_dl?bs=qq&spec=100&dst_uin="+this.props.author.qq}/>

                <div className="content">
                    <div className="header">{this.props.author.name}</div>
                </div>
            </div>
        );
    }
});

var Users = React.createClass({
    render: function () {
        var userRows = [];
        for (var i = 0; i < this.props.users.length; i++) {
            var user = this.props.users[i];
            userRows.push(<User key={i} author={user}/>);
        }
        return (
            <div className="ui middle aligned selection list">
                {userRows}
            </div>
        );
    }
});

var Page = React.createClass({
    getInitialState: function () {
        room.getMessage(function (data) {
            var messages = this.state.messages;
            console.log(data);
            messages.unshift({
                author: data.author,
                content: data.content,
                date: data.date
            });
            this.setState({messages: messages});
        }.bind(this));
        room.userOnline(function (user) {
            var users = this.state.users;
            var names = users.map(function (user) {
                return user.name;
            });
            var index = names.indexOf(user.name);
            if (index < 0) {
                users.push(user);
            }
            this.setState({users: users});
        }.bind(this));
        room.userLeave(function (user) {
            var users = this.state.users;
            var names = users.map(function (user) {
                return user.name;
            });
            var index = names.indexOf(user.name);
            if (index >= 0) {
                users.splice(index, 1);
            }
            this.setState({users: users});
        }.bind(this));
        return {messages: [], users: [], me: null};
    },
    componentDidMount: function () {
        $.ajax('/room', {
            dataType: 'json',
            success: function (data) {
                this.setState({
                    messages: data.messages,
                    users: data.users,
                    me: data.me
                });
            }.bind(this)
        });
    },
    handleTalk: function (content) {
        var messages = this.state.messages;
        var me = this.state.me;
        messages.unshift({
            author: {name: 'me', qq: me.qq},
            content: content,
            date: moment()
        });
        this.setState({messages: messages});
        room.sendMessage(content);
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
                        <Users users={this.state.users}/>
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
