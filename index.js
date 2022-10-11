#!/usr/bin/env node

`use strict` ;

const colors = require ( `colors` ) ;

const { Client, WebhookClient } = require ( `discord.js` ) ;

const dotenv = require ( `dotenv` ) . config () ;

const client = new Client ( { partials : [ `MESSAGE` , `REACTION` ] } ) ;

const PREFIX = `$` ;

const webhook_client = new WebhookClient ( process . env . WEBHOOK_ID , process . env . WEBHOOK_TOKEN ) ;

client . login ( process . env . DISCORDJS_BOT_TOKEN ) ;

client . on ( `message` , async ( message ) =>
	{
		if ( message . author . bot )
		{
			return ;
		}
		if ( message . content . startsWith ( PREFIX ) )
		{
			const [ CMD_NAME , ... args ] = message . content . trim () . substring ( PREFIX . length ) . split ( /\s+/ ) ;
			if ( CMD_NAME === `kick` )
			{
				if ( ! message . member . hasPermission ( `KICK_MEMBERS` ) )
				{
					return ( message . reply ( `Permissions required to kick users are missing.` ) ) ;
				}
				if ( args . length === 0 )
				{
					return ( message . reply ( `Provide a user ID.` ) ) ;
				}
				const member = message . guild . members . cache . get ( args [ 0 ] ) ;
				if ( member )
				{
					member . kick () . then ( ( member ) =>
						{
							message . channel . send ( `${ member } was kicked.` ) ;
							return ;
						}
					) . catch ( ( error ) =>
						{
							console . error ( error . message . brightRed ) ;
							message . channel . send ( `Unable to kick user.` ) ;
							return ;
						}
					) ;
				}
				else
				{
					message . channel . send ( `User not found.` ) ;
				}
			}
			else if ( CMD_NAME === `ban` )
			{
				if ( ! message . member . hasPermission ( `BAN_MEMBERS` ) )
				{
					return ( message . reply ( `Permissions required to ban users are missing.` ) ) ;
				}
				if ( args . length === 0 )
				{
					return ( message . reply ( `Provide a user ID.` ) ) ;
				}
				try
				{
					const user = await message . guild . members . ban ( args [ 0 ] ) ;
					message . channel . send ( `User was banned successfully` ) ;
				}
				catch ( error )
				{
					console . error ( error . message . brightRed ) ;
					message . channel . send ( `Unable to ban user.` ) ;
				}
			}
			else if ( CMD_NAME === `announce` )
			{
				console . log ( args . brightWhite ) ;
				const msg = args . join ( ` ` ) ;
				console . log ( msg . brightWhite ) ;
				webhook_client . send ( msg ) ;
			}
			return ;
		}
	}
) ;

client . on ( `messageReactionAdd` , ( reaction, user ) =>
	{
		const { name } = reaction . emoji ;
		const member = reaction . message . guild . members . cache . get ( user . id ) ;
		if ( reaction . message . id === `738666523408990258` )
		{
			switch ( name )
			{
				case ( `🍎` ) :
					member . roles . add ( `738664659103776818` ) ;
					break ;
				case ( `🍌` ) :
					member . roles . add ( `738664632838782998` ) ;
					break ;
				case ( `🍇` ) :
					member . roles . add ( `738664618511171634` ) ;
					break ;
				case ( `🍑` ) :
					member . roles . add ( `738664590178779167` ) ;
					break ;
			}
		}
		return ;
	}
) ;

client . on ( `messageReactionRemove` , ( reaction , user ) =>
	{
		const { name } = reaction . emoji ;
		const member = reaction . message . guild . members . cache . get ( user . id ) ;
		if ( reaction . message . id === `738666523408990258` )
		{
			switch ( name )
			{
				case ( `🍎` ) :
					member . roles . remove ( `738664659103776818` ) ;
					break ;
				case ( `🍌` ) :
					member . roles . remove ( `738664632838782998` ) ;
					break ;
				case ( `🍇` ) :
					member . roles . remove ( `738664618511171634` ) ;
					break ;
				case ( `🍑` ) :
					member . roles . remove ( `738664590178779167` ) ;
					break ;
			}
		}
		return ;
	}
) ;

client . on ( `ready` , () =>
	{
		console . log ( `logged in user: ` . brightWhite , `${ client . user . tag }` . brightGreen ) ;
		return ;
	}
) ;
