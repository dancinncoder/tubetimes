export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      arrivals: {
        Row: {
          createdAt: string
          destinationName: string | null
          destinationNaptanId: string | null
          expectedArrival: string | null
          id: number
          lineId: string | null
          lineName: string | null
          NaptanId: string | null
          platformName: string | null
          stationName: string | null
          timeToStation: number | null
          towards: string | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          destinationName?: string | null
          destinationNaptanId?: string | null
          expectedArrival?: string | null
          id?: number
          lineId?: string | null
          lineName?: string | null
          NaptanId?: string | null
          platformName?: string | null
          stationName?: string | null
          timeToStation?: number | null
          towards?: string | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          destinationName?: string | null
          destinationNaptanId?: string | null
          expectedArrival?: string | null
          id?: number
          lineId?: string | null
          lineName?: string | null
          NaptanId?: string | null
          platformName?: string | null
          stationName?: string | null
          timeToStation?: number | null
          towards?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arrivals_lineId_fkey"
            columns: ["lineId"]
            isOneToOne: true
            referencedRelation: "lines"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "arrivals_lineName_fkey"
            columns: ["lineName"]
            isOneToOne: true
            referencedRelation: "lines"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "arrivals_NaptanId_fkey"
            columns: ["NaptanId"]
            isOneToOne: true
            referencedRelation: "stations"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "arrivals_stationName_fkey"
            columns: ["stationName"]
            isOneToOne: true
            referencedRelation: "stations"
            referencedColumns: ["name"]
          },
        ]
      }
      lines: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          name: string | null
          uid: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          uid?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          uid?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      real_time_updates: {
        Row: {
          data: Json | null
          id: number
          latest_update: string
          NaptanId: string | null
        }
        Insert: {
          data?: Json | null
          id?: number
          latest_update?: string
          NaptanId?: string | null
        }
        Update: {
          data?: Json | null
          id?: number
          latest_update?: string
          NaptanId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "real_time_updates_NaptanId_fkey"
            columns: ["NaptanId"]
            isOneToOne: true
            referencedRelation: "stations"
            referencedColumns: ["uid"]
          },
        ]
      }
      stations: {
        Row: {
          created_at: string
          id: number
          lat: number | null
          long: number | null
          name: string | null
          uid: string | null
          updated_at: string | null
          zone: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          lat?: number | null
          long?: number | null
          name?: string | null
          uid?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          lat?: number | null
          long?: number | null
          name?: string | null
          uid?: string | null
          updated_at?: string | null
          zone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
