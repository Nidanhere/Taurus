import { ArrowUp, ArrowDown } from 'lucide-react';

const cryptoData = [
  {
    symbol: 'BTC',
    balance: '0.45213',
    price: '$64,240.50',
    change: '+2.41%',
    changeDollar: '+$1,512.34',
    isPositive: true,
    sparkline: 'M10,80 Q30,70 50,75 T90,60 T130,65 T170,50 T210,55 T250,40'
  },
  {
    symbol: 'ETH',
    balance: '3.57213',
    price: '$6,273.84',
    change: '-1.92%',
    changeDollar: '-$122.45',
    isPositive: false,
    sparkline: 'M10,40 Q30,50 50,45 T90,55 T130,50 T170,60 T210,55 T250,65'
  },
  {
    symbol: 'SOL',
    balance: '12.84500',
    price: '$1,140.41',
    change: '-2.24%',
    changeDollar: '-$26.18',
    isPositive: false,
    sparkline: 'M10,60 Q30,55 50,65 T90,60 T130,70 T170,65 T210,75 T250,70'
  },
  {
    symbol: 'XRP',
    balance: '856.21400',
    price: '$2,800.16',
    change: '+1.59%',
    changeDollar: '+$44.12',
    isPositive: true,
    sparkline: 'M10,70 Q30,65 50,60 T90,55 T130,50 T170,45 T210,40 T250,35'
  }
];

const CryptoCard = ({ data }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#121212] to-[#18181b] p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl">
      {/* Background Sparkline */}
      <svg
        className="absolute inset-0 h-full w-full opacity-10"
        viewBox="0 0 260 100"
        preserveAspectRatio="none"
      >
        <path
          d={data.sparkline}
          fill="none"
          stroke={data.isPositive ? '#34d399' : '#fb7185'}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-white">{data.symbol}</h3>
            <p className="text-sm text-gray-400 mt-0.5">{data.balance}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
            <span className="text-xs font-semibold text-white/80">{data.symbol[0]}</span>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto">
          <div className="text-2xl font-bold text-white mb-2">{data.price}</div>
          <div className="flex items-center gap-2">
            {data.isPositive ? (
              <ArrowUp className="h-4 w-4 text-emerald-400" />
            ) : (
              <ArrowDown className="h-4 w-4 text-rose-400" />
            )}
            <span
              className={`text-sm font-medium ${
                data.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {data.change}
            </span>
            <span className="text-xs text-gray-500">{data.changeDollar}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export function CryptoCards() {
  return (
    <div className="w-full px-5 py-8 sm:px-10 lg:px-14 xl:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cryptoData.map((crypto, index) => (
            <CryptoCard key={index} data={crypto} />
          ))}
        </div>
      </div>
    </div>
  );
}
