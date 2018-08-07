const State = {
  pending: 0,
  resolved: 1,
  rejected: 2
}

class ES6Promise {
  constructor(executor) {
      this._state = State.pending;    // 保存状态，取值为 State 之一
      this._value = undefined;        // 保存 resolve 或 reject 时所传入的值
      this._callbacks = [];           // 保存状态监听函数，promise 状态变化时调用

      if (typeof executor === 'function') {
          let resolve = (value) => {
              this._transition(State.resolved, value);
          };

          let reject = (value) => {
              this._transition(State.rejected, value);
          };
          executor(resolve, reject);
      }
  }

  // 状态转移
  _transition(state, value) {        
      if (this._state === State.pending) {    
          this._state = state;               
          this._value = value;
          this._callbacks.forEach(callback => callback());
      } 
  }
  // 状态
  then(onResolved, onRejected) {
    let self = this;

    let promise2 = new ES6Promise((resolve, reject) => {
        let scheduleFn = () => {
            setTimeout(() => {

                onResolved = typeof onResolved === 'function' ? onResolved : v => v;
                onRejected = typeof onRejected === 'function' ? onRejected : v => {throw v};
                try {
                    if (self._state === State.resolved) {
                        resolve(onResolved(self._value));
                    } else {
                        resolve(onRejected(self._value));
                    }                    
                } catch (e) {
                    reject(e);
                }
            });
        }

        if (this._state === State.pending) {
            this._callbacks.push(scheduleFn);
        } else {
            scheduleFn();
        }
    });

    return promise2;
}
}