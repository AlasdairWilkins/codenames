import {api, namespace, resume, session} from "./Api";

import store from "./store/store"
import { set } from "./store/actions";

class Startup {
    constructor() {

        if (document.cookie) {
            api.get(resume, (err, msg) => {
                if (msg.name) {
                    store.dispatch(set('name', msg.name))
                }

                //fix this!!!!!!!
                store.dispatch(set('nsp', msg.namespace))
                store.dispatch(set('display', 'waiting'))
                // above should become dynamic
            })
        } else {
            let loc = new URL(window.location);
            let params = new URLSearchParams(loc.search);
            if (params.has('code')) {
                this.handleParamsCode(params)
            }
        }
    }

    handleParamsCode(params) {
        let code = params.get('code')
        api.set(namespace, code, (err, status) => {
            if (status) {
                api.get(session, (err, cookie) => {
                    document.cookie = cookie
                    store.dispatch(set('nsp', code))
                    store.dispatch(set('display', 'waiting'))
                });
            } else {
                console.log("Whoops")
                //Handle incorrect game code
            }
        })
    }
}

export default Startup