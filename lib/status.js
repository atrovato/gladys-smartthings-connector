
module.exports = {
  step: {
    config: {
      load: 'LOAD_CONFIG',
      save: 'SAVE_CONFIG'
    },
    app: {
      check: 'CHECK_APP',
      create: 'CREATE_APP'
    },
    location: {
      list: 'GET_LOCATIONS',
      create: 'CREATE_LOCATION',
      save: 'SAVE_LOCATIONS'
    }
  },
  progress: (step) => {
    console.log('PROGRESS with', step);
    gladys.socket.emit('smtHandleReq', { step: step, status: 'IN_PROGRESS' });
  },
  done: (step) => {
    console.log('DONE with', step);
    gladys.socket.emit('smtHandleReq', { step: step, status: 'DONE' });
  },
  fail: (step) => {
    console.log('FAIL with', step);
    gladys.socket.emit('smtHandleReq', { step: step, status: 'FAIL' });
  }
};