/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#E6F7F8',
  				'100': '#CCEFF1',
  				'200': '#99DFE3',
  				'300': '#66CFD5',
  				'400': '#33BFC7',
  				'500': '#0B6B6F',
  				'600': '#09565A',
  				'700': '#074145',
  				'800': '#052C30',
  				'900': '#03171A',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				'50': '#FEF9E7',
  				'100': '#FDF3CF',
  				'200': '#FBE79F',
  				'300': '#F9DB6F',
  				'400': '#F7CF3F',
  				'500': '#F3A712',
  				'600': '#C2850E',
  				'700': '#91630B',
  				'800': '#604107',
  				'900': '#2F2004',
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				'50': '#F4F5F6',
  				'100': '#E9EBED',
  				'200': '#D3D7DB',
  				'300': '#BDC3C9',
  				'400': '#A7AFB7',
  				'500': '#2F3A44',
  				'600': '#252E36',
  				'700': '#1B2228',
  				'800': '#11161A',
  				'900': '#080A0C',
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			success: {
  				'50': '#E8F5E8',
  				'100': '#D1EBD1',
  				'200': '#A3D7A3',
  				'300': '#75C375',
  				'400': '#47AF47',
  				'500': '#2E8B57',
  				'600': '#256F45',
  				'700': '#1C5333',
  				'800': '#133721',
  				'900': '#0A1B0F',
  				DEFAULT: '#2E8B57',
  				foreground: '#FFFFFF'
  			},
  			error: {
  				'50': '#FBE8E8',
  				'100': '#F7D1D1',
  				'200': '#EFA3A3',
  				'300': '#E77575',
  				'400': '#DF4747',
  				'500': '#D64545',
  				'600': '#AB3737',
  				'700': '#802929',
  				'800': '#551B1B',
  				'900': '#2A0D0D',
  				DEFAULT: '#D64545',
  				foreground: '#FFFFFF'
  			},
  			info: {
  				'50': '#E6F2FF',
  				'100': '#CCE5FF',
  				'200': '#99CBFF',
  				'300': '#66B1FF',
  				'400': '#3397FF',
  				'500': '#2B7AE4',
  				'600': '#2262B6',
  				'700': '#1A4988',
  				'800': '#11305A',
  				'900': '#09172C',
  				DEFAULT: '#2B7AE4',
  				foreground: '#FFFFFF'
  			},
  			disabled: {
  				DEFAULT: '#BAC4C9',
  				foreground: '#FFFFFF'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			heading: [
  				'Source Sans Pro',
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xs: [
  				'12px',
  				'16px'
  			],
  			sm: [
  				'14px',
  				'20px'
  			],
  			base: [
  				'16px',
  				'24px'
  			],
  			lg: [
  				'18px',
  				'28px'
  			],
  			xl: [
  				'20px',
  				'28px'
  			],
  			'2xl': [
  				'24px',
  				'36px'
  			],
  			'3xl': [
  				'30px',
  				'40px'
  			],
  			'4xl': [
  				'36px',
  				'48px'
  			],
  			'5xl': [
  				'48px',
  				'56px'
  			],
  			'6xl': [
  				'60px',
  				'72px'
  			]
  		},
  		fontWeight: {
  			normal: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700'
  		},
  		borderRadius: {
  			none: '0',
  			sm: 'calc(var(--radius) - 4px)',
  			DEFAULT: '6px',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: '16px',
  			'2xl': '24px',
  			full: '9999px'
  		},
  		spacing: {
  			'0': '0px',
  			'1': '4px',
  			'2': '8px',
  			'3': '12px',
  			'4': '16px',
  			'5': '20px',
  			'6': '24px',
  			'8': '32px',
  			'10': '40px',
  			'12': '48px',
  			'16': '64px',
  			'20': '80px',
  			'24': '96px',
  			'32': '128px'
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  			inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			'elevation-100': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			'elevation-200': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			'elevation-300': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.4s ease-out',
  			'fade-in-up': 'fadeInUp 0.4s ease-out',
  			'fade-in-down': 'fadeInDown 0.4s ease-out',
  			'slide-in-left': 'slideInLeft 0.3s ease-out',
  			'slide-in-right': 'slideInRight 0.3s ease-out',
  			'scale-in': 'scaleIn 0.2s ease-out',
  			'bounce-in': 'bounceIn 0.6s ease-out',
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			shimmer: 'shimmer 2s linear infinite',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			fadeInUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			fadeInDown: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			slideInRight: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(20px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			bounceIn: {
  				'0%': {
  					opacity: '0',
  					transform: 'scale(0.3)'
  				},
  				'50%': {
  					opacity: '1',
  					transform: 'scale(1.05)'
  				},
  				'70%': {
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'scale(1)'
  				}
  			},
  			shimmer: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(100%)'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		screens: {
  			xs: '475px',
  			sm: '640px',
  			md: '768px',
  			lg: '1024px',
  			xl: '1280px',
  			'2xl': '1536px'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
}