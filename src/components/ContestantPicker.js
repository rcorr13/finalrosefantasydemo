import React from "react";
import '@atlaskit/css-reset';
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import axios from "axios";
import Image from "react-bootstrap/Image";

const Container = styled.div`
    display: flex;
    `;

const SmallButton = styled(Button)`
  display: flex;
  justify-content: center;
  align-item: center;
  font-size: 1.5em;
  border-radius: 10px;
  height: 50px;
  min-width: 100px;
  margin-top: 90px;
`
const ContainerColumn = styled.div`
    margin: 8px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width: 500px;
    display: flex;
    flex-direction: column;
    `;

const Title = styled.h3`
    font-size: 2.5em;
    text-align: center;
    padding: 8px;
    `;

const ContestantList = styled.div`
    padding: 8px;
    transition: background-color 0.2s ease;
    background-color: ${props => (props.isDraggingOver ? 'skyblue' : 'white')};
    flex-grow: 1;
    min-height: 150px; 
    `;

const ContainerContestantPicture = styled.div`
    margin-left: 20px;
    display: flex;
    flex-direction: column;
`;

const ContainerContestantName = styled.div`
    align-items: center;
    margin-left: 20px;
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
`;

const ContainerContestant = styled.div`
    font-size: 2em;
    border: 1px solid lightgrey;
    border-radius: 2px;
    padding: 8px;
    margin-bottom: 8px;
    background-color: ${props =>
    (props.type === 'onTeam'  ? 'lightgreen' :
        (props.isDragging ? 'lightgrey' : 'white'))};
    display: flex;
    flex-direction: row;
`;

class ContestantPicker extends React.Component {

    componentDidMount() {
        this.fetchContestants();
    }

    async fetchContestants() {
        let users = await this.allUsers();
        const {isAuthenticated, user} = this.props.auth;
        const userFull = (users.find(userID => userID._id===user.id));

        let contestants = await this.allContestants();
        const pickedContestants = (userFull.picks)
            .map(contestantLink => contestants.find(contestant => contestant.nameLink === contestantLink))
            .filter(contestant => contestant.status === "on")
            .map(contestant => contestant.nameLink);

        contestants = contestants.filter(contestant => contestant.status === "on")

        let logistics = await this.getLogistics();

        const unselectedContestants = contestants
            .map(contestantInfo => contestantInfo.nameLink)
            .filter(contestantLink => !(pickedContestants.includes(contestantLink)));

        this.setState({
            contestants: contestants,
            user: userFull,
            currentWeek: logistics[0].currentWeek
        });

        const columnsUpdate = {...this.state.columns};
        columnsUpdate.column1.contestantIndices = unselectedContestants;
        columnsUpdate.column2.contestantIndices = pickedContestants;
        this.setState({columnsUpdate});
        console.log(this.state)

    }

    async allContestants() {
        //return (await axios.get('http://localhost:5000/contestants')).data
        return (await axios.get('https://finalrosefantasydemo.herokuapp.com/contestants')).data
    }

    async allUsers() {
        //return (await axios.get('http://localhost:5000/users')).data
        return (await axios.get('https://finalrosefantasydemo.herokuapp.com/users')).data
    }

    async getLogistics() {
        //return (await axios.get('http://localhost:5000/users')).data
        return (await axios.get('https://finalrosefantasydemo.herokuapp.com/logistics')).data
    }

    constructor(props) {
        super(props);
        const {isAuthenticated, user} = this.props.auth;
        this.state = {
            user: user,
            contestants: [],
            currentWeek: "0",
            columns: {
                'column1': {
                    id: 'column1',
                    title: 'All Contestants',
                    contestantIndices: []
                },
                'column2': {
                    id: 'column2',
                    title: 'My Picks',
                    contestantIndices: [],
                },
            },
            columnOrder: ['column1', 'column2'],
        };
    }

    onDragEnd = result => {
        // updates contestant list with new order of contestants
        const {destination, source, draggableId} = result;


        console.log(draggableId);

        // dropped outside the list
        if (!destination) {
            return;
        }

        // dropped in same spot
        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];



        if (start === finish) {
            const newContestantIds = Array.from(start.contestantIndices);

            newContestantIds.splice(newContestantIds.indexOf(draggableId), 1);

            newContestantIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...start,
                contestantIndices: newContestantIds,
            }

            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };

            this.setState(newState);
            return;
        }

        // if contestant on team, won't move to the next list
        if (this.contestantOnTeam(draggableId)) {
            return;
        }


        // moving from one list to the other
        const startContestantIds = Array.from(start.contestantIndices);
        startContestantIds.splice(startContestantIds.indexOf(draggableId), 1);

        const newStart = {
            ...start,
            contestantIndices: startContestantIds,
        };

        const finishContestantIds = Array.from(finish.contestantIndices);
        console.log(finishContestantIds)
        finishContestantIds.splice(destination.index, 0, draggableId);
        console.log(finishContestantIds)

        const newFinish = {
            ...finish,
            contestantIndices: finishContestantIds,
        };

        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        this.setState(newState)
    };

    handleClick = () => {
        const contestantsPickedIds = this.state.columns["column2"].contestantIndices;
        const user = this.state.user;

        console.log(user)

        const updatedUser = {
            ...user,
            picks: contestantsPickedIds,
        };

        console.log(updatedUser)

        axios.put(('https://finalrosefantasydemo.herokuapp.com/updateuser/'+user._id), {
            updatedUser
        })
            .then(res => console.log(res.data));

        alert('Picks have been submitted!')
    }

    contestantOnTeam = (nameLink) => {
        return (((this.state.user['week' + (parseInt(this.state.currentWeek) - 1).toString() + 'team']).includes(nameLink)))
    }

    typeContestant = (nameLink) => {
        let typeName = '';
        if (this.contestantOnTeam(nameLink)) {
            typeName = 'onTeam'
        } else {
            typeName = 'movable';
        }
        return typeName;
    }

    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Container>
                    {this.state.columnOrder.map(columnId => {
                        const column = this.state.columns[columnId];
                        const contestantsColumn = column.contestantIndices.map(contestantIndex => (this.state.contestants.find(element => element.nameLink === contestantIndex)))
                        const contestantNames = [];
                        const userStr = JSON.stringify(contestantsColumn);
                        JSON.parse(userStr, (key, value) => {
                            if (key === 'nameLink') {
                                return contestantNames.push(value);
                            }
                        });
                        return (
                            <ContainerColumn key={column.id}>
                                <Title>{column.title}</Title>
                                <Droppable droppableId={column.id}>
                                    {(provided,snapshot) => (
                                        <ContestantList
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            isDraggingOver={snapshot.isDraggingOver}
                                        >
                                            {contestantNames.map((nameLink,index) => {
                                                //const isDragDisabled = ((this.state.user['week' + (parseInt(this.state.currentWeek)-1).toString() + 'team']).includes(nameLink))
                                                return (
                                                    <Draggable
                                                        key={nameLink}
                                                        draggableId={nameLink}
                                                        index={index}
                                                        //isDragDisabled={isDragDisabled}
                                                        type={this.typeContestant(nameLink)}
                                                    >
                                                        {(provided, snapshot) => (
                                                            <ContainerContestant
                                                                isDragging={snapshot.isDragging}
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                //isDragDisabled={isDragDisabled}
                                                                type={this.typeContestant(nameLink)}
                                                            >
                                                                <ContainerContestantPicture><Image src={
                                                                    ((this.state.contestants.find(element => element.nameLink === nameLink))).imageLink}
                                                                                                   width="70"
                                                                                                   roundedCircle/></ContainerContestantPicture>
                                                                <ContainerContestantName> {nameLink.replace('-', ' ')} </ContainerContestantName>
                                                            </ContainerContestant>)
                                                        }
                                                    </Draggable>)})
                                            }
                                            {provided.placeholder}
                                        </ContestantList>)}
                                </Droppable>
                            </ContainerColumn>
                        )
                    })}
                    <SmallButton variant="primary" onClick={this.handleClick}> Submit </SmallButton>
                </Container>
            </DragDropContext>

        );
    };
}

ContestantPicker.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export default connect(mapStateToProps)(withRouter(ContestantPicker));
