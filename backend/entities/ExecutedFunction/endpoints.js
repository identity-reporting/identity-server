import { logger } from "../../logger.js"
import { expressEndpointResolver } from "../../utils/expressEndpointResolver.js"
import { ENTITY_NAME, ENTITY_NAME_URL } from "./constants.js"
import { deleteExecutedFunction, getAllExecutedFunctions, getExecutedFunctionByID, runCodeOnClientApplication, runFunctionWithInput } from "./controller.js"




export const registerExpressEndpoints = (app) => {
    logger.debug(`Registering endpoints for ${ENTITY_NAME}`)
    const url = (endpoint) => {
        return `/${ENTITY_NAME_URL}/${endpoint}`
    }
    
    app.post(url('run-function-with-input'), expressEndpointResolver(req => runFunctionWithInput(req.body)));
    app.post(url('delete-executed-function/:id'), expressEndpointResolver((req) => deleteExecutedFunction(req.params.id)));
    app.get(url("get-executed-functions"), expressEndpointResolver(getAllExecutedFunctions))
    app.get(url('get-executed-function/:id'), expressEndpointResolver((req) => getExecutedFunctionByID(req.params.id)))
}

export const registerSocketEndpoints = (socketIOInstance, socket) => {
    logger.debug(`Registering socket endpoints for ${ENTITY_NAME}`)
    const url = (endpoint) => {
        return `${ENTITY_NAME_URL}/${endpoint}`
    }


    return {
        [url('run_function_with_code')]: async (socketServer, socket, data) => {
            await runCodeOnClientApplication(socket, data.payload.code)
        }
    }

}