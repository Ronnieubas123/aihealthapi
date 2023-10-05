const messagesModel = require("../Model/messagesModel");
const conversationModel = require("../Model/conversationModel");
const patientFormModel = require("../Model/patientFormModel");
const ipModel = require("../Model/visitorIpModel");
const request = require("request");
const date = require('date-and-time');
const registrationModel = require("../Model/registrationModel");
const accountMemberModel = require("../Model/accountMemberModel");
const { aggregate } = require("../Model/paymentModel");

const consulation =  async (req, res) => {
    // request body 
    const {token, consulationId, userId, role, content, completionToken  } = req.body;

    // check if the message is empty
    if (!content) return res.status(500).json("Input field required!!!");

    //check if userId is empty
    let ip;
    if (!userId && !token) {
        
        let ip = await fetch('https://api.ipify.org?format=json')
            .then(x => x.json())
            .then(({ ip }) => {
                return ip;
            
        });
        console.log("ip", ip);

        //check if role is bot 
        if(role === "bot") {
            res.status(200).json("bot");
        } else {
            // visitor limit chat
            // find the IP in ipModel
            const getIpValue = await ipModel.findOne({ip});

            // check the ip limit value if lessthan 1 or 0 return the "Limit reached. You need to signup."
            if (getIpValue.limit < 1) return res.status(400).json("You already used your free messages. Sign up for free to send more messages. ");

            // else if the limit is not equal or lessthan 0
            // minus the limit to 1
            const limitValue = getIpValue.limit - completionToken;
            const limitUse = getIpValue.creditLimitUse + completionToken;
            //create new varaiable. We will use this varaiable for conditioning 
            const filter = { ip: ip };
            // create new variable. This variable is the limit value we will save this value in ip table
            const update = { limit: limitValue, creditLimitUse: limitUse };

            // update ip table with condition and value
            let updateLimit = await ipModel.findOneAndUpdate(filter, update);
            res.status(200).json({"left":limitValue, "use":limitUse});
        }

    } else {
        console.log("userId", userId);
        let checkGeneratedId = '';
        // get generated consulation Id
        const getGeneratedId = await conversationModel.findOne({consulationId: consulationId});

        // check if getGeneratedId has value
        if (getGeneratedId) {
            // assign the generated value in new varaiable
            checkGeneratedId  = getGeneratedId.consulationId;
        }
        // Check if generated id is exist.

        if(consulationId === checkGeneratedId) {
            // if exist no need to save in conversation table
        } else if(consulationId != checkGeneratedId) {
            // else it means that this conversation is new. We will save it in the conversation table
            request.post(
                'https://api-aihealthpros.azurewebsites.net/create_thread_title/', {json: {question: content}},
                function (error, response, body) {
                    const conversation = new conversationModel({
                        consulationId: consulationId,
                        userId: userId,
                        conversationTitle: body.thread_title
                    });
                    const conversationResponse =  conversation.save();
                }
                );
        }
        let registerLimitValue = 0;
        let limitUse = 0;
        if (role === "user") {
            //Registered user limit
            const getUserLimit = await registrationModel.findOne({_id: userId});

            console.log("getUserLimit", getUserLimit);
            if (getUserLimit.limit < 1) return res.status(400).json("You already used your free messages.");

            registerLimitValue = getUserLimit.limit - completionToken;
            limitUse = getUserLimit.creditLimitUse + completionToken;

            //create new varaiable. We will use this varaiable for conditioning 
            const filter = { _id: userId };
            // create new variable. This variable is the limit value we will save this value in ip table
            const update = { limit: registerLimitValue, creditLimitUse: limitUse  };

            // update ip table with condition and value
            let updateLimit = await registrationModel.findOneAndUpdate(filter, update);
            //  res.status(200).json(limitValue);
        }
        

        // save consulation messages
        const newMessage = new messagesModel({
            consulationId: consulationId,
            userId: userId,
            role: role,
            content: content
        });

        // save the message
        const response =  await newMessage.save();

        if (response) {
            if (role === "user") {
                res.status(200).json({"left": registerLimitValue, "total_use": limitUse });
                registerLimitValue = 0;
                limitUse = 0;
            } else {
                res.status(200).json(response);
            }
        }

        // return response
        
    }

};

const history = async (req, res) => {
    const userId = req.params.currentUserId;
    let { dateFrom, dateTo } = req.body; 

    const dFrom = date.format((new Date(dateFrom)),
  'YYYY-MM-DD');

    const dTo = date.format((new Date(dateTo)),
  'YYYY-MM-DD');

  if (!dateFrom && !dateTo) {
    const conversationHistory = await conversationModel
    .find( 
            {
                userId: userId
            }
        )
    .sort([["createdAt", -1]]);
    res.status(200).json(conversationHistory);
  } else {
    if (dFrom === dTo) {

        const nextDay = new Date(dTo);
        nextDay.setDate(nextDay.getDate() + 1);
        const addedDate = nextDay.toISOString();
    
        const conversationHistory = await conversationModel
            .find( 
                    {
                        userId: userId,
                        createdAt: {
                            $gte: dFrom,
                            $lt: addedDate
                        }
                    }
                )
            .sort([["createdAt", -1]]);
            res.status(200).json(conversationHistory);
        }
        else {
        const nextDay = new Date(dTo);
        nextDay.setDate(nextDay.getDate() + 1);
        const addedDate = nextDay.toISOString();
        const conversationHistory = await conversationModel
            .find( 
                    {
                        userId: userId,
                        createdAt: {
                            $gte: dFrom, 
                            $lte: addedDate
                        }
                    }
                )
            .sort([["createdAt", -1]]);
            res.status(200).json(conversationHistory);
      }
  }
    
};

const viewhistory = async (req, res) => {
    const consulationId = req.params.viewChatHistory;
    const messageHistorys = await messagesModel.find({ consulationId: consulationId });

    const patientHistoryDistinct = await patientFormModel.aggregate([
        {
            $sort: { createdAt: -1 } // Sort by timestamp in descending order
          },
        {
            $group: {
                _id: '$patientInfo.patientName',
                distinctIds: { $first: '$_id' }
            }
        },
            {   
            $project: {
              _id: 0, // Exclude the "_id" field
              name: "$_id", // Rename "_id" to "name"
              distinctIds: 1 // Include the "ids" field
            }
        }, 
        
    ]);

    let patientsId = patientHistoryDistinct.map(item => item.distinctIds.valueOf());
   
    const patientHistory  = await patientFormModel.find({_id: patientsId});
      res.status(200).json({
        "patient_form": patientHistory,
        "messages": messageHistorys
    });
};

const patientForm = async(req, res) => {
    const { consultationId, patientInfo, userId  } = req.body;

    try {
        const newPatientForm = new patientFormModel({
            consultationId: consultationId, 
            patientInfo: patientInfo,
            userId: userId,
        });
        const response =  await newPatientForm.save();
        res.status(200).json(response); 
    } catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const accountMember = async(req, res) => {
    const { userId, name } = req.body;

    try {
        const newAccountMember = new accountMemberModel({
            userId, name
        });

        const response = await newAccountMember.save();
        res.status(200).json(response);
    }catch(error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const accountMembersList = async(req, res) => {
    const userId = req.params.userId; 

    const newAccountMembersList = await accountMemberModel
            .find( 
                    {
                        userId: userId
                    }
                )
            .sort([["createdAt", -1]]);
            res.status(200).json(newAccountMembersList);
}

module.exports = {
    consulation,
    history,
    viewhistory,
    patientForm,
    accountMember,
    accountMembersList
};
