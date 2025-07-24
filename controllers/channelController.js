//import
//import



// Hämtar alla kanaler från databasen
export async function fetchAllChannels(req, res) {
  try {
    const channels = await getAllChannels();
    return res.status(200).json({
      success: true,
      data: channels,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Något gick fel vid hämtning av kanaler",
    });
  }
}

// Hämtar en specifik kanal baserat på dess ID.
export async function getChannelById(req, res) {
  const { channelId } = req.params;
  try {
    const channel = await getChannelModel(channelId);
    if (!channel) {
      return res.status(404).json({ error: "Kanal hittades inte" });
    }
    return res.status(200).json({
      success: true,
      data: channel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Fel vid hämtning av kanal",
    });
  }
}

// Skapar en ny kanal.
export async function addChannel(req, res) {
  const { channel_name } = req.body;
  const userId = req.user.id;

  if (!channel_name) {
    return res.status(400).json({ error: "name krävs" });
  }

  try {
    const newChannel = await createChannel(channel_name, userId);
    await addSubscription(userId, newChannel.channel_id);

    return res.status(201).json({
      success: true,
      data: newChannel,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Kunde inte skapa kanal",
    });
  }
}

// Hämtar alla meddelanden från en specifik kanal.
export async function getMessagesInChannel(req, res) {
  const { channelId } = req.params;

  try {
    const messages = await getMessagesModel(channelId);
    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "Fel vid hämtning av meddelanden",
    });
  }
}

// Lägger till ett nytt meddelande i en kanal.
export async function postMessageToChannel(req, res) {
  const { channelId } = req.params; 
  const { title, content } = req.body;  

  if (!title || !content) { 
    return res.status(400).json({ error: "title och content krävs" }); 
  }

  try {
    const newMessage = await postMessageModel( // Skapar ett nytt meddelande i den angivna kanalen.
      channelId,
      req.user.id,
      title,
      content
    );
    return res.status(201).json({ // Skickar tillbaka det nya meddelandet.
      success: true,
      data: newMessage,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ // Hanterar eventuella fel som uppstår under processen.
      success: false,
      error: "Kunde inte posta meddelande", // Skickar tillbaka ett felmeddelande om något går fel.
    });
  }
}