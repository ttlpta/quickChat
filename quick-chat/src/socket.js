import io from 'socket.io-client';

import { SOCKET_BASE_URL } from './contanst';

export default io.connect(SOCKET_BASE_URL);