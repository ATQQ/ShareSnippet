export interface Prop {
	key: string
	value: string
	description: string
	required: boolean // 是否必要的属性
	bind: boolean // 是否以 :param=”xx” 的形式展示
	hide_value: boolean // 是否展示值选择列表
}
export interface CodeSnippet {
	scope: string, // 支持的语言列表
	prefix: string, // 前缀
	body: string | string[], // 片段内容
	description: string // 片段描述
	type: snippetType
}

export interface TagComponent extends CodeSnippet {
	name: string // 组件名称
	props: Prop[] // 参数
	self_closing: boolean // 自闭和
	language: languageType
}

export interface TemplateConfig extends CodeSnippet {
	name: string // 模板名称即prefix
	path: string // 文件路径
}
export type languageType = 'vue' | 'react';
export type snippetType = 'tag' | 'template' | 'component';