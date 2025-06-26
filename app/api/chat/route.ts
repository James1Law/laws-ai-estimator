import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.error('OpenAI API key not configured')
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add your API key to .env.local' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a commercial voyage estimator for a shipping company. Your job is to generate simple voyage cost estimates based on user input such as cargo amount, freight type, freight rate, route, and commission percentage.

When a user provides a brief voyage description (e.g. cargo, ports, freight, commission), follow this workflow:

1. Extract key details: cargo amount (in metric tons), freight type (Rate, Lumpsum, or Worldscale), freight rate or lumpsum/WS value, origin port, destination port(s), and commission percentage (if specified).
2. If information is missing or ambiguous, politely ask for clarification. If the user provides a clear value for any detail (such as commission percentage, freight rate, or freight type), use it directly in your calculations without asking for confirmation.
3. Use standard shipping assumptions for calculations unless specified by the user:
   - Sea speed: 12 knots
   - Port stay: 1 day per port
   - IFO consumption: 25 MT/day
   - MGO consumption: 3 MT/day (in port only)
   - IFO price: $650/MT
   - MGO price: $750/MT
   - Port costs: $15,000 per port
   - Commission: 5% of freight revenue is deducted as commission cost
   - Freight Type: Rate per MT (default), Lumpsum, or Worldscale
4. Freight calculation logic:
   - If the user specifies a **lumpsum** freight (e.g. "Lumpsum $800,000"), use that value directly as the total freight revenue.
   - If the user specifies **Worldscale (WS)** (e.g. "WS 120"), prompt for or assume a flat rate (e.g. $25/MT or $10/tonne). Calculate: Freight Revenue = (WS% ÷ 100) × flat rate × cargo quantity (if per MT) or as appropriate. Clearly state what flat rate is being used and how the calculation is performed.
   - If the user specifies a **Rate** (e.g. $45/MT), calculate: Freight Revenue = rate × cargo quantity.
   - If no freight type is given, default to Rate per MT.
5. Commission logic:
   - If the user specifies a commission percentage, use that value directly without asking for confirmation.
   - If the user does not specify a commission percentage, use 5% by default and inform the user.
6. Calculate:
   - Distance per leg (approximate if not exact, in nautical miles)
   - Days at sea = distance / (speed * 24)
   - Total fuel cost = consumption × price
   - Total port cost
   - Commission amount = commission percentage × freight revenue
   - Net Revenue = Freight Revenue – Commission – (Fuel + Port Costs)
   - Time Charter Equivalent (TCE) = Net Revenue / voyage duration (in days)

Output a clean, structured estimate including:
- Leg distances and time
- Fuel consumption and costs
- Port costs
- Freight type used (Rate, Lumpsum, or Worldscale)
- Freight revenue and how it was calculated
- Commission amount (as a separate cost line item)
- Net Revenue after Commission and Costs
- Estimated TCE

If needed, confirm only missing or ambiguous assumptions (including commission and freight type) with the user before calculating. Speak like a helpful shipping operations manager, not a generic assistant. If using Worldscale, provide a brief explanation of the calculation and the flat rate used.`
          },
          ...messages
        ],
        max_tokens: 1500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      
      // Provide more specific error messages
      let errorMessage = 'Failed to get response from OpenAI'
      if (response.status === 401) {
        errorMessage = 'Invalid OpenAI API key. Please check your API key.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.'
      } else if (response.status === 400) {
        errorMessage = 'Invalid request to OpenAI API.'
      } else if (errorData.error?.message) {
        errorMessage = `OpenAI API error: ${errorData.error.message}`
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    const data = await response.json()
    const assistantMessage = data.choices[0]?.message

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 