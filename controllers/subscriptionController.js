//import
//import
//import

// Hämta alla prenumerationer för en användare
export async function getUserSubscriptions(req, res) { // Hämtar prenumerationer för den inloggade användaren
  const userId = req.user.id ; // Hämtar användarens ID från JWT-token

  if (!userId) { // Om användar-ID inte finns, returnera ett felmeddelande
    return res.status(401).json({ error: "Ingen användare angiven" });
  }

  try {
    const subscriptions = await getSubscriptionsByUser(userId); // Hämtar prenumerationer för användaren.
    return res.status(200).json({ success: true, data: subscriptions }); // Skickar tillbaka prenumerationerna.
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Kunde inte hämta prenumerationer" }); // Hanterar eventuella fel som uppstår vid hämtning av prenumerationer.
  }
}

// Prenumerera på kanal
export async function subscribeToChannel(req, res) { // Lägger till en prenumeration för den inloggade användaren
  const userId = req.user.id; // Hämtar användarens ID från JWT-token
  const { channel_id } = req.body; // Hämtar kanal-ID från begäran

  if (!userId || !channel_id) { // Om användar-ID eller kanal-ID saknas, returnera ett felmeddelande
    return res.status(400).json({ error: "user_id och channel_id krävs" });
  }

  try {
    const subscription = await addSubscription(userId, channel_id); // Lägger till prenumerationen i databasen
    if (!subscription) { // Om prenumerationen redan finns, returnera ett meddelande
      return res
        .status(200)
        .json({ success: true, message: "Redan prenumerant" });
    }
    return res.status(201).json({ success: true, data: subscription }); // Skickar tillbaka den skapade prenumerationen
  } catch (err) { // Hanterar eventuella fel som uppstår vid skapandet av prenumerationen
    console.error(err); 
    return res.status(500).json({ error: "Kunde inte skapa prenumeration" }); 
  }
}