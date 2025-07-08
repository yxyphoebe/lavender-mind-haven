
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
			// MINDFUL AI 品牌色彩系统 - 严格按照品牌规范
			mindful: {
				// 主色渐变起始色（淡紫色）
				50: '#f8f7ff',
				100: '#eeebff',
				200: '#e1dcff',
				300: '#d4ccff',
				400: '#c8c6ff', // #C8C6FF - 品牌主色渐变起始
				500: '#a78bfa',
				600: '#8c5cf0',
				700: '#7c3aed',
				800: '#6b21a8',
				900: '#581c87',
			},
			enso: {
				// 主色渐变结束色（淡蓝色）
				50: '#f7fcff',
				100: '#eef8ff',
				200: '#ddeeff',
				300: '#c7e4ff',
				400: '#a9d9ff', // #A9D9FF - 品牌主色渐变结束
				500: '#60a5fa',
				600: '#3b82f6',
				700: '#2563eb',
				800: '#1d4ed8',
				900: '#1e3a8a',
			},
			// 品牌辅助色彩
			lotus: {
				50: '#fef9fc',
				100: '#fdf4f8',
				200: '#fbe9f2',
				300: '#f8dee9',
				400: '#f6e9f9', // #F6E9F9 - 莲花粉
				500: '#f3d4e6',
				600: '#e5b8d0',
				700: '#d196b5',
				800: '#b8729a',
				900: '#9f5c85',
			},
			sage: {
				50: '#f6f8f6',
				100: '#eef1ed',
				200: '#dce3da',
				300: '#c8d5c5',
				400: '#bacdb7', // #BACDB7 - 鼠尾草绿
				500: '#a1b89d',
				600: '#8aa085',
				700: '#71856d',
				800: '#5c6b58',
				900: '#4c5849',
			},
			bamboo: {
				50: '#f9fafb',
				100: '#f3f5f7', // #F3F5F7 - 竹灰色
				200: '#e5e8ec',
				300: '#d6dbe1',
				400: '#c7ced6',
				500: '#9ca3af',
				600: '#6b7280',
				700: '#4b5563',
				800: '#374151',
				900: '#1f2937',
			},
			// 强调色 - 深靛蓝
			accent: {
				50: '#eef0fe',
				100: '#dde1fd',
				200: '#c2c8fc',
				300: '#9ca8fa',
				400: '#748af9',
				500: '#5f6af8', // #5F6AF8 - 深靛蓝（按钮和重点元素）
				600: '#4f46e5',
				700: '#4338ca',
				800: '#3730a3',
				900: '#312e81',
			},
				neutral: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
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
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bloom': {
					'0%': {
						transform: 'scale(0) rotate(-10deg)',
						opacity: '0'
					},
					'50%': {
						transform: 'scale(1.1) rotate(0deg)',
						opacity: '0.8'
					},
					'100%': {
						transform: 'scale(1) rotate(0deg)',
						opacity: '1'
					}
				},
				'gentle-float': {
					'0%, 100%': {
						transform: 'translateY(0px)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(100%)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'bloom': 'bloom 2s ease-out',
				'gentle-float': 'gentle-float 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.6s ease-out'
			},
			fontFamily: {
				'sans': ['Inter', 'ui-sans-serif', 'system-ui'],
				'display': ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
