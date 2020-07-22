/**
 * @api {get} /messages Show all messages
 * @apiDescription Returns all public messages if no ?fromId is specified.
 *                 If it is then it will show all messages to or from the user with the fromId.
 * @apiName GetMessages
 * @apiGroup Messages
 *
 * @apiHeader {String} _wab_auth_jwt Login token:JWT-Token.
 *
 * @apiSuccess {Object[]} messages                          Array of messages.
 *      @apiSuccess {Object} messages.message                   One message from the array.
 *          @apiSuccess {Number} messages.message.id                 messages unique id.
 *          @apiSuccess {String} messages.message.text               Text of the message.
 *          @apiSuccess {String} messages.message.createdAt          Date of creation.
 *          @apiSuccess {String} messages.message.updatedAt          Date of last update.
 *
 *          @apiSuccess {Object} messages.message.from               Sender.
 *              @apiSuccess {Number} messages.message.from.id            Senders id.
 *              @apiSuccess {String} messages.message.from.firstName     Senders firstName.
 *              @apiSuccess {String} messages.message.from.lastName      Senders lastName.
 *              @apiSuccess {String} messages.message.from.email         Senders email.
 *
 *          @apiSuccess {Object} messages.message.to                 Receiver - can be null if message is public.
 *              @apiSuccess {Number} [messages.message.to.id]            Receivers id.
 *              @apiSuccess {String} [messages.message.to.firstName]     Receivers firstName.
 *              @apiSuccess {String} [messages.message.to.lastName]      Receivers lastName.
 *              @apiSuccess {String} [messages.message.to.email]         Receivers email.
 *
 *      @apiSuccess {Object} _meta                               Meta information.
 *          @apiSuccess {Number} _meta.page
 *          @apiSuccess {Number} _meta.limit
 *          @apiSuccess {Number} _meta.total
 *          @apiSuccess {Number} _meta.offset
 *          @apiSuccess {Number} _meta.previous
 *          @apiSuccess {Number} _meta.next
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *      "messages": [
 *          {
 *              "id": 1,
 *              "text": "message 1 test",
 *              "createdAt": "2020-06-18T13:07:03.000Z",
 *              "updatedAt": "2020-06-18T13:07:03.000Z",
 *              "from": {
 *                  "id": 1,
 *                  "firstName": "firstName",
 *                  "lastName": "lastName",
 *                  "email": "mail@mail.com"
 *              },
 *              "to": null
 *          },
 *          {
 *              "id": 7,
 *              "text": "Hi @all",
 *              "createdAt": "2020-06-18T13:07:03.000Z",
 *              "updatedAt": "2020-06-18T13:07:03.000Z",
 *              "from": {
 *                  "id": 2,
 *                  "firstName": "first",
 *                  "lastName": "name",
 *                  "email": "mail@mail.com"
 *              },
 *              "to": null
 *          }
 *      ],
 *      "_meta": {
 *          "page": 1,
 *          "limit": 25,
 *          "total": 2,
 *          "offset": 0,
 *          "previous": -1,
 *          "next": -1
 *      }
 *  }
 * 
 * @apiError 404 No messages found (Maybe you have not sent any messages).
 */

/**
 * @api {get} /messages/:id Show message with id
 * @apiDescription Returns the message with the specified id.
 * 
 * @apiName GetMessage
 * @apiGroup Messages
 *
 * @apiHeader {String} _wab_auth_jwt Login token:JWT-Token.
 *
 * @apiSuccess {Object} message                One message.
 *      @apiSuccess {Number} message.id                 messages unique id.
 *      @apiSuccess {String} message.text               Text of the message.
 *      @apiSuccess {String} message.createdAt          Date of creation.
 *      @apiSuccess {String} message.updatedAt          Date of last update.
 *
 *      @apiSuccess {Object} message.from               Sender of the message.
 *          @apiSuccess {Number} message.from.id            Senders id.
 *          @apiSuccess {String} message.from.firstName     Senders firstName.
 *          @apiSuccess {String} message.from.lastName      Senders lastName.
 *          @apiSuccess {String} message.from.email         Senders email.
 *
 *      @apiSuccess {Object} message.to                 Receiver of the message. - can be null if message is public.
 *          @apiSuccess {Number} [message.to.id]            Receivers id.
 *          @apiSuccess {String} [message.to.firstName]     Receivers firstName.
 *          @apiSuccess {String} [message.to.lastName]      Receivers lastName.
 *          @apiSuccess {String} [message.to.email]         Receivers email.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *	{
 *	    "message": {
 *	        "id": 1,
 *	        "text": "Hi User2",
 *	        "createdAt": "2020-06-18T13:07:03.000Z",
 *	        "updatedAt": "2020-06-18T13:07:03.000Z",
 *	        "from": {
 *	            "id": 1,
 *	            "firstName": "firstName",
 *	            "lastName": "lastName",
 *	            "email": "mail@mail.com"
 *	        },
 *	        "to": {
 *	            "id": 2,
 *	            "firstName": "firstName",
 *	            "lastName": "lastName",
 *	            "email": "mail@mail.com"
 *	        }
 *	    }
 * 	}
 * 
 * @apiError 404 No message found with this <code>id</code> (Maybe you are not the creator of this message).
 */

/**
 * @api {post} /messages Create message
 * @apiDescription Creates a message in the database with the given body.
 * 
 * @apiName CreateMessage
 * @apiGroup Messages
 *
 * @apiHeader {String} _wab_auth_jwt Login token:JWT-Token.
 *
 * @apiExample {json} Request (example):
 *  json-body:
 *  {
 *      "message": {
 *          "text": "Hi from ApiDoc",
 *          "fromId": 1,
 *          "toId": 2
 *      }
 *  }
 *
 * @apiSuccess {Object} message                One message.
 *      @apiSuccess {Number} message.id                 Message id.
 *  	@apiSuccess {String} message.text               Text of the message.
 *  	@apiSuccess {Number} message.fromId             Sender id.
 *  	@apiSuccess {Number} message.toId               Receiver id (can be null for public message).
 *  	@apiSuccess {String} message.createdAt          Date of creation.
 *  	@apiSuccess {String} message.updatedAt          Date of last update.
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 *	{
 *      "message": {
 *          "id": 6,
 *          "text": "Hi from ApiDoc",
 *          "fromId": 1,
 *          "toId": 2,
 *          "updatedAt": "2020-06-18T13:54:21.513Z",
 *          "createdAt": "2020-06-18T13:54:21.513Z"
 *      }
 *  }
*/

/**
 * @api {put} /messages/:id Update message with id
 * @apiDescription Updates the message in the database at the given id with the send body
 * 
 * @apiName UpdateMessage
 * @apiGroup Messages
 *
 * @apiHeader {String} _wab_auth_jwt Login token:JWT-Token.
 *
 * @apiExample {json} Request (example):
 *  json-body:
 *  {
 *      "message": {
 *          "text": "Hi from Postman",
 *          "fromId": 1,
 *          "toId": 2
 *      }
 *  }
 *
 * @apiSuccess {Object} message                One message.
 *      @apiSuccess {Number} message.id                 Messages unique id.
 *      @apiSuccess {String} message.text               Text of the message.
 *      @apiSuccess {Number} message.fromId             Sender id.
 *      @apiSuccess {Number} message.toId               Receiver id (can be null for public message).
 *      @apiSuccess {String} message.createdAt          Date of creation.
 *      @apiSuccess {String} message.updatedAt          Date of last update.
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 202 OK
 * {
 *     "message": {
 *         "id": 6,
 *         "text": "Hi from ApiDoc",
 *         "createdAt": "2020-06-18T13:54:21.513Z"
 *         "updatedAt": "2020-06-18T13:54:21.513Z",
 *         "fromId": 1,
 *         "toId": 2,
 *     }
 * }
 * 
 * @apiError 400 Check your body structure.
 * @apiError 404 No message found with this <code>id</code> (Maybe you are not the creator of this message).
 */

/**
 * @api {delete} /messages/:id Delete message with id
 * @apiDescription Wont delete but obfuscate the message -> change text to 'deleted'.
 * 
 * @apiName DeleteMessage
 * @apiGroup Messages
 *
 * @apiHeader {String} _wab_auth_jwt Login token:JWT-Token.
 *
 * @apiSuccess 204 Message was deleted
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 204 No Content
 * {
 * }
 * 
 * @apiError 404 No message found with this <code>id</code> (Maybe you are not the creator of this message).
*/